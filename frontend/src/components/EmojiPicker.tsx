'use client'
import { ActionIcon, Popover, Box, Text } from '@mantine/core';
import { IconMoodSmile } from '@tabler/icons-react';
import { useState } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const COMMON_EMOJIS = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',
  '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
  '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪',
  '🤨', '🧐', '🤓', '😎', '🥳', '😏', '😒', '😞',
  '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫',
  '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
  '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤',
  '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
  '🔥', '✨', '⭐', '🌟', '💫', '💥', '💯', '✅',
];

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [opened, setOpened] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpened(false);
  };

  return (
    <Popover 
      opened={opened} 
      onChange={setOpened}
      position="top"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          onClick={() => setOpened((o) => !o)}
          size="lg"
          title="Emoji ekle"
        >
          <IconMoodSmile size={20} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Box p="xs">
          <Text size="xs" fw={600} mb="xs">Emoji Seç</Text>
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '4px',
              maxWidth: '300px',
            }}
          >
            {COMMON_EMOJIS.map((emoji, index) => (
              <Box
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                style={{
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f3f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {emoji}
              </Box>
            ))}
          </Box>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
