'use client';

import { Box, Button, Stack, TextField } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage },
    ];

    setMessages(updatedMessages);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        const chars = data.message.split('');

        for (let i = 0; i < chars.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 10));

          setMessages((prev) => {
            const updated = [...prev];

            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + chars[i],
            };

            return updated;
          });
        }
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Error occurred.' },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }, [messages]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)',
        p: 2,
      }}
    >
      <Stack
        sx={{
          width: {
            xs: '100%',
            sm: '90%',
            md: '700px',
          },
          height: '85vh',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              AI
            </Box>

            <Box>
              <h3 style={{ margin: 0, color: 'white' }}>
                Headstarter AI Support
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: '14px',
                }}
              >
                Online • Ready to help
              </p>
            </Box>
          </Box>
        </Box>
        <Stack
          spacing={2}
          flexGrow={1}
          overflow="auto"
          sx={{
            p: 3,
            bgcolor: 'transparent',
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                sx={{
                  maxWidth: '75%',
                  px: 4,
                  py: 2,
                  borderRadius: 4,
                  background:
                    message.role === 'assistant'
                      ? 'rgba(255,255,255,0.12)'
                      : 'linear-gradient(135deg,#2563eb,#3b82f6)',
                  color: 'white',
                  boxShadow:
                    message.role === 'assistant'
                      ? 'none'
                      : '0 8px 20px rgba(37,99,235,0.4)',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </Box>
            </Box>
          ))}
          {/* {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <span>AI is thinking</span>
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </Box>
            </Box>
          )} */}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            p: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                color: 'white',
                background: 'rgba(255,255,255,0.08)',

                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },

                '&:hover fieldset': {
                  borderColor: '#60a5fa',
                },

                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },

              '& .MuiInputLabel-root': {
                color: '#cbd5e1',
              },
            }}
          />

          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              borderRadius: '16px',
              px: 4,
              background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
            }}
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
