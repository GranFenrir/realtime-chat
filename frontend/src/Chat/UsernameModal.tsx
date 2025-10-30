'use client'
import { Modal, TextInput, Button, Stack } from '@mantine/core';
import { useState } from 'react';

interface UsernameModalProps {
  opened: boolean;
  onClose: () => void;
  currentUsername: string;
  onSave: (newUsername: string) => void;
}

export function UsernameModal({ opened, onClose, currentUsername, onSave }: UsernameModalProps) {
  const [username, setUsername] = useState(currentUsername);

  const handleSave = () => {
    if (username.trim() && username.trim() !== currentUsername) {
      onSave(username.trim());
      onClose();
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Kullanıcı Adını Değiştir"
      centered
    >
      <Stack>
        <TextInput
          label="Kullanıcı Adı"
          placeholder="Yeni kullanıcı adınızı girin"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          maxLength={20}
        />
        <Button onClick={handleSave} disabled={!username.trim() || username.trim() === currentUsername}>
          Kaydet
        </Button>
      </Stack>
    </Modal>
  );
}
