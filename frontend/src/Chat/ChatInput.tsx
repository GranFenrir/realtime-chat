'use client'
import { TextInput, Button, Group, ActionIcon, FileButton } from '@mantine/core';
import { IconSend, IconPhoto } from '@tabler/icons-react';
import { EmojiPicker } from '@/components/EmojiPicker';
import { useState, KeyboardEvent, useRef } from 'react';

interface ChatInputProps {
  onSendMessageAction: (message: string | undefined, imageData?: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatInput({ onSendMessageAction, onTyping }: ChatInputProps) {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    if (text.trim() || imagePreview) {
      const messageText = text.trim();
      onSendMessageAction(messageText || undefined, imagePreview || undefined);
      setText('');
      setSelectedImage(null);
      setImagePreview(null);
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

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if too large (max 800px width/height)
          const maxSize = 800;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;
    
    // Validate file size (10MB max before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu çok büyük! Maksimum 10MB yükleyebilirsiniz.');
      return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      alert('Geçersiz dosya tipi! Sadece JPEG, PNG, GIF veya WebP formatları desteklenir.');
      return;
    }
    
    setSelectedImage(file);
    
    try {
      // Compress and create preview
      const compressed = await compressImage(file);
      setImagePreview(compressed);
    } catch (error) {
      console.error('Image compression error:', error);
      alert('Resim yüklenirken bir hata oluştu.');
      setSelectedImage(null);
      setImagePreview(null);
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
      {imagePreview && (
        <Group gap="xs" mb="xs" style={{ position: 'relative' }}>
          <img 
            src={imagePreview} 
            alt="Preview" 
            style={{ 
              maxHeight: '100px', 
              maxWidth: '150px', 
              borderRadius: '8px',
              objectFit: 'cover'
            }} 
          />
          <ActionIcon 
            size="sm" 
            color="red" 
            variant="filled"
            onClick={() => {
              setSelectedImage(null);
              setImagePreview(null);
            }}
            style={{ 
              position: 'absolute', 
              top: '5px', 
              right: '5px' 
            }}
          >
            ✕
          </ActionIcon>
        </Group>
      )}
      <Group gap="xs" align="flex-end" wrap="nowrap">
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        <FileButton onChange={handleImageSelect} accept="image/png,image/jpeg,image/gif,image/webp">
          {(props) => (
            <ActionIcon 
              {...props}
              size="lg" 
              variant="light" 
              color="gray"
              radius="md"
            >
              <IconPhoto size={20} />
            </ActionIcon>
          )}
        </FileButton>
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
          disabled={!text.trim() && !imagePreview}
        >
          <IconSend size={20} />
        </ActionIcon>
      </Group>
    </form>
  );
}