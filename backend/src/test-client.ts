import { io } from 'socket.io-client';

const socket = io('http://localhost:3003');

// Test message
const testMessage = {
  id: '1',
  text: 'Test message',
  userId: 'test-user',
  timestamp: Date.now()
};

// Connect to server
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Send test message
  socket.emit('message', testMessage);
});

// Listen for messages
socket.on('message', (data) => {
  console.log('Received message:', data);
});