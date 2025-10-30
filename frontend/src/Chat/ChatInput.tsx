'use client'
import { TextInput, Button, Group, ActionIcon } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { EmojiPicker } from '@/components/EmojiPicker';
import { useState, KeyboardEvent, useRef } from 'react';

interface ChatInputProps {
  onSendMessageAction: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatInput({ onSendMessageAction, onTyping }: ChatInputProps) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    if (text.trim()) {
      onSendMessageAction(text.trim());
      setText('');
      // Mesaj gönderildiğinde typing'i durdur
      if (onTyping) {
        onTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
    
    // Typing indicator
    if (onTyping) {
      onTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing after 1 second
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setText(prev => prev + emoji);
    
    // Emoji eklediğinde typing indicator'ı tetikle
    if (onTyping) {
      onTyping(true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="xs" align="flex-end" wrap="nowrap">
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        <TextInput
          placeholder="Mesajınızı yazın..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
          size="md"
          radius="md"
        />
        <ActionIcon 
          type="submit" 
          size="lg" 
          variant="filled" 
          color="blue"
          radius="md"
          disabled={!text.trim()}
        >
          <IconSend size={20} />
        </ActionIcon>
      </Group>
    </form>
  );
}