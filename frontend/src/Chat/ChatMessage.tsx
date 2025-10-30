'use client'
import { Paper, Text, Group, Box } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/tr';

// Dayjs plugins
dayjs.extend(relativeTime);
dayjs.locale('tr');

interface Message {
  id: string;
  text?: string;
  userId: string;
  username: string;
  timestamp: number;
  imageUrl?: string;
  imageData?: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

// UserId'den tutarlı renk oluştur
function getUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return colors[Math.abs(hash) % colors.length];
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const userColor = getUserColor(message.userId);
  
  // Relative time veya normal time
  const getTimeDisplay = () => {
    const messageTime = dayjs(message.timestamp);
    const now = dayjs();
    const diffInHours = now.diff(messageTime, 'hour');
    
    // 24 saatten eskiyse tam tarih göster
    if (diffInHours > 24) {
      return messageTime.format('DD MMM, HH:mm');
    }
    // Değilse relative time
    return messageTime.fromNow();
  };
  
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
      }}
    >
      <Paper
        shadow="sm"
        p="sm"
        radius="md"
        style={{
          maxWidth: '70%',
          backgroundColor: isOwnMessage ? '#E3F2FD' : '#F5F5F5',
          border: isOwnMessage ? '1px solid #2196F3' : '1px solid #E0E0E0',
        }}
      >
        {!isOwnMessage && (
          <Group gap="xs" mb={4}>
            <IconUser size={16} color={userColor} />
            <Text size="sm" fw={600} c={userColor}>
              {message.username}
            </Text>
          </Group>
        )}
        
        {(message.imageData || message.imageUrl) && (
          <Box mb="xs">
            <img 
              src={message.imageData || message.imageUrl} 
              alt="Shared image"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
              onClick={() => {
                // Open image in new tab
                window.open(message.imageData || message.imageUrl, '_blank');
              }}
            />
          </Box>
        )}
        
        {message.text && (
          <Text size="md" style={{ wordBreak: 'break-word' }}>
            {message.text}
          </Text>
        )}
        
        <Text size="xs" c="dimmed" mt={4} ta={isOwnMessage ? 'right' : 'left'}>
          {getTimeDisplay()}
        </Text>
      </Paper>
    </Box>
  );
}
