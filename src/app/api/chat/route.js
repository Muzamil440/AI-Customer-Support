import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const prompt = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return NextResponse.json({
      message: response,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
