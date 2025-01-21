'use client'
import { useState, useEffect } from "react";
import { Container, Paper, Title, Stack } from '@mantine/core';
import { ChatInput } from '@/Chat/ChatInput';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    
    try {
      const newSocket = io('http://localhost:3003', { 
        reconnection: true,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setSocket(newSocket);
        setError(null);
      });

      return () => {
        newSocket.close();
      };
    } 
    catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <Container size="sm">
      <Paper shadow="md" p="md">
        <Stack>
          <Title order={2}>Real-time Chat</Title>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {messages.map((msg) => (
            <div key={msg.id}>
              <p>{msg.text}</p>
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
          <ChatInput onSendMessageAction={(text) => {
            if (socket && isConnected) {
              const message = {
                id: uuidv4(),
                text,
                userId: 'user',
                timestamp: Date.now(),
              };
              socket.emit('message', message);
              setMessages(prev => [...prev, message]);
            }
          }} />
        </Stack>
      </Paper>
    </Container>
  );
}
