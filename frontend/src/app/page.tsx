'use client'
import { useState, useEffect, useRef } from "react";
import { Container, Paper, Title, Stack, Badge, ScrollArea, Box, Group, Text, ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { ChatInput } from '@/Chat/ChatInput';
import { ChatMessage } from '@/Chat/ChatMessage';
import { UsernameModal } from '@/Chat/UsernameModal';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text?: string;
  userId: string;
  username: string; // Kullanıcı adı eklendi
  timestamp: number;
  imageUrl?: string;
  imageData?: string;
}

// LocalStorage'dan userId ve username al veya oluştur
function getUserInfo() {
  if (typeof window === 'undefined') return { userId: '', username: '' };
  
  let userId = localStorage.getItem('chatUserId');
  let username = localStorage.getItem('chatUsername');
  
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('chatUserId', userId);
  }
  
  if (!username) {
    username = `User_${userId.substring(0, 4)}`;
    localStorage.setItem('chatUsername', username);
  }
  
  return { userId, username };
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [userInfo, setUserInfo] = useState({ userId: '', username: '' });
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Array<{ userId: string; username: string }>>([]);
  const [usernameModalOpened, setUsernameModalOpened] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Backend URL from environment variable
  const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3006';

  // Get user info on mount
  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
    setMounted(true);
  }, []);

  // Socket connection
  useEffect(() => {
    if (!mounted) {
      return;
    }
    
    try {
      const newSocket = io(backendUrl, { 
        reconnection: true,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling']
      });

      // Connection handler
      newSocket.on('connect', () => {
        console.log('✅ Socket connected');
        setIsConnected(true);
        setSocket(newSocket);
        setError(null);
        
        // Kullanıcı katıldığını bildir
        if (userInfo.userId && userInfo.username) {
          newSocket.emit('userJoined', {
            userId: userInfo.userId,
            username: userInfo.username
          });
        }
      });

      // Disconnect handler
      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
      });

      // Message listener - EN ÖNEMLİ: Gelen mesajları dinle
      const handleMessage = (message: Message) => {
        console.log('📩 Mesaj alındı:', message);
        setMessages(prev => {
          // Duplicate mesaj kontrolü
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      };

      newSocket.on('message', handleMessage);

      // Message history listener - İlk bağlantıda eski mesajları al
      const handleMessageHistory = (history: Message[]) => {
        console.log(`📚 Mesaj geçmişi alındı: ${history.length} mesaj`);
        setMessages(history);
      };

      newSocket.on('messageHistory', handleMessageHistory);

      // User typing listener
      const handleUserTyping = (data: { userId: string; username: string; isTyping: boolean }) => {
        if (data.userId === userInfo.userId) return; // Kendi typing event'imizi gösterme
        
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          if (data.isTyping) {
            newMap.set(data.userId, data.username);
          } else {
            newMap.delete(data.userId);
          }
          return newMap;
        });
      };

      newSocket.on('userTyping', handleUserTyping);

      // Online users listener
      const handleOnlineUsers = (users: Array<{ userId: string; username: string }>) => {
        console.log('👥 Online kullanıcılar güncellendi:', users.length);
        setOnlineUsers(users);
      };

      newSocket.on('onlineUsers', handleOnlineUsers);

      // Username change listener - Diğer kullanıcıların isim değişikliğini dinle
      const handleUsernameChanged = (data: { userId: string; newUsername: string }) => {
        console.log('👤 Kullanıcı adı değişti:', data);
        // Mesajlardaki bu kullanıcının tüm username'lerini güncelle
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.userId === data.userId
              ? { ...msg, username: data.newUsername }
              : msg
          )
        );
        
        // Online users listesini güncelle
        setOnlineUsers(prevUsers =>
          prevUsers.map(user =>
            user.userId === data.userId
              ? { ...user, username: data.newUsername }
              : user
          )
        );
      };

      newSocket.on('usernameChanged', handleUsernameChanged);

      // Error handler
      newSocket.on('connect_error', (err) => {
        console.error('🔴 Connection error:', err.message);
        setError(`Bağlantı hatası: ${err.message}`);
      });

      // Cleanup function - Memory leak önleme
      return () => {
        console.log('🧹 Socket cleanup...');
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('message', handleMessage);
        newSocket.off('messageHistory', handleMessageHistory);
        newSocket.off('userTyping', handleUserTyping);
        newSocket.off('onlineUsers', handleOnlineUsers);
        newSocket.off('usernameChanged', handleUsernameChanged);
        newSocket.off('connect_error');
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
  }, [mounted, backendUrl]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ 
        top: viewport.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, [messages]);

  // Kullanıcı adı değiştirme fonksiyonu
  const handleUsernameChange = (newUsername: string) => {
    const updatedInfo = { ...userInfo, username: newUsername };
    setUserInfo(updatedInfo);
    localStorage.setItem('chatUsername', newUsername);
    
    // ESKİ mesajlardaki username'i güncelle (Yaklaşım 1)
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.userId === userInfo.userId 
          ? { ...msg, username: newUsername }
          : msg
      )
    );
    
    // Backend'e güncellemeyi bildir
    if (socket && isConnected) {
      socket.emit('userJoined', {
        userId: updatedInfo.userId,
        username: updatedInfo.username
      });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Container size="xl" style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '20px', paddingBottom: '20px' }}>
      <Group align="flex-start" gap="md" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Main Chat Area */}
        <Paper shadow="md" p="md" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 40px)' }}>
        <Stack gap="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box>
            <Group justify="space-between" align="center">
              <Title order={2}>💬 Real-time Chat</Title>
              <Group gap="xs">
                <ColorSchemeToggle />
                <Badge 
                  color={isConnected ? 'green' : 'red'} 
                  variant="filled"
                  size="lg"
                >
                  {isConnected ? '🟢 Bağlı' : '🔴 Bağlantı Yok'}
                </Badge>
              </Group>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Kullanıcı: {userInfo.username}
              </Text>
              <ActionIcon 
                size="sm" 
                variant="subtle" 
                onClick={() => setUsernameModalOpened(true)}
                title="Kullanıcı adını değiştir"
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Group>
          </Box>

          {/* Error Display */}
          {error && (
            <Paper p="xs" bg="red.1" style={{ border: '1px solid #fa5252' }}>
              <Text c="red" size="sm">⚠️ {error}</Text>
            </Paper>
          )}

          {/* Messages Area */}
          <ScrollArea 
            style={{ flex: 1 }} 
            viewportRef={viewport}
            type="auto"
          >
            <Stack gap="xs" p="xs">
              {messages.length === 0 ? (
                <Paper p="xl" bg="gray.0" style={{ textAlign: 'center' }}>
                  <Text c="dimmed" size="sm">
                    👋 Henüz mesaj yok. İlk mesajı sen gönder!
                  </Text>
                </Paper>
              ) : (
                messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    isOwnMessage={msg.userId === userInfo.userId}
                  />
                ))
              )}
            </Stack>
          </ScrollArea>

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <Box px="xs">
              <Text size="xs" c="dimmed" fs="italic">
                {Array.from(typingUsers.values()).join(', ')} yazıyor...
              </Text>
            </Box>
          )}

          {/* Input Area - Sabit alt kısım */}
          <Box 
            style={{ 
              borderTop: '1px solid #e0e0e0', 
              paddingTop: '12px',
              backgroundColor: 'var(--mantine-color-body)',
            }}
          >
            <ChatInput 
              onSendMessageAction={(text, imageData) => {
                if (socket && isConnected && userInfo.userId) {
                  const message: Message = {
                    id: uuidv4(),
                    text: text || undefined,
                    userId: userInfo.userId,
                    username: userInfo.username,
                    timestamp: Date.now(),
                    imageData: imageData,
                  };
                  console.log('📤 Sending message:', {
                    id: message.id,
                    text: message.text,
                    hasImage: !!message.imageData,
                    imageSize: message.imageData?.length || 0
                  });
                  // Mesajı backend'e gönder (backend tüm clientlara broadcast edecek)
                  socket.emit('message', message);
                  // Kendi mesajımızı da state'e ekleyelim (daha hızlı feedback)
                  // Backend'den gelen mesajda duplicate kontrolü var
                  setMessages(prev => [...prev, message]);
                }
              }}
              onTyping={(isTyping) => {
                if (socket && isConnected && userInfo.userId) {
                  socket.emit('typing', {
                    userId: userInfo.userId,
                    username: userInfo.username,
                    isTyping
                  });
                }
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Online Users Sidebar */}
      <Paper shadow="md" p="md" style={{ width: '250px', maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
        <Title order={4} mb="md">👥 Online Users</Title>
        <Badge color="blue" variant="filled" mb="md">
          {onlineUsers.length} online
        </Badge>
        <ScrollArea style={{ flex: 1 }}>
          <Stack gap="xs">
            {onlineUsers.map((user) => (
              <Paper 
                key={user.userId} 
                p="xs" 
                bg={user.userId === userInfo.userId ? 'blue.0' : 'gray.0'}
                style={{ 
                  border: user.userId === userInfo.userId ? '1px solid #2196F3' : '1px solid transparent',
                  borderRadius: '8px'
                }}
              >
                <Group gap="xs">
                  <Box
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50'
                    }}
                  />
                  <Text size="sm" fw={user.userId === userInfo.userId ? 600 : 400}>
                    {user.username}
                    {user.userId === userInfo.userId && ' (Sen)'}
                  </Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>
      </Paper>
      </Group>

      {/* Username Modal */}
      <UsernameModal 
        opened={usernameModalOpened}
        onClose={() => setUsernameModalOpened(false)}
        currentUsername={userInfo.username}
        onSave={handleUsernameChange}
      />
    </Container>
  );
}
