'use client'
import { TextInput, Button, Group } from '@mantine/core';
import { useState } from 'react';

interface ChatInputProps {
  onSendMessageAction: (message: string) => void;
}

export function ChatInput({ onSendMessageAction }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessageAction(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <TextInput
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Button type="submit">Send</Button>
      </Group>
    </form>
  );
}