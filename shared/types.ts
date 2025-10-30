/**
 * Shared Types between Backend and Frontend
 * These types ensure type safety across the entire application
 */

/**
 * Chat Message Interface
 * Represents a single message in the chat
 */
export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: number;
}

/**
 * User Interface
 * Represents a connected user
 */
export interface User {
  userId: string;
  username: string;
  socketId?: string;
}

/**
 * Typing Event Interface
 * Represents when a user is typing
 */
export interface TypingEvent {
  userId: string;
  username: string;
  isTyping: boolean;
}

/**
 * User Joined Event Interface
 * Represents when a user joins the chat
 */
export interface UserJoinedEvent {
  userId: string;
  username: string;
}

/**
 * Socket Events
 * All possible socket event names
 */
export const SocketEvents = {
  // Client -> Server
  MESSAGE: 'message',
  TYPING: 'typing',
  USER_JOINED: 'userJoined',
  
  // Server -> Client
  MESSAGE_HISTORY: 'messageHistory',
  ONLINE_USERS: 'onlineUsers',
  USER_TYPING: 'userTyping',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const;

/**
 * Validation Constants
 */
export const ValidationRules = {
  MESSAGE_MIN_LENGTH: 1,
  MESSAGE_MAX_LENGTH: 1000,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
} as const;
