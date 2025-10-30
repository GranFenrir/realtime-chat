# Real-time Chat Application

This is a real-time chat application built with Next.js for the frontend and NestJS for the backend. It uses Socket.IO for real-time communication.

## ✨ Features

- 💬 **Real-time messaging** with Socket.IO
- 👤 **Unique user identification** system with customizable usernames
- 📝 **Message history** (in-memory, last 100 messages)
- 🎨 **Modern UI** with Mantine components
- 🔄 **Auto-scroll** to latest messages
- 🟢 **Live connection status** indicator
- 📱 **Responsive design**
- 🎯 **Message bubbles** with user differentiation
- 🌈 **Color-coded users** based on their ID
- ⚡ **Fast and efficient**
- 🔒 **Environment-based** configuration
- ⌨️ **Typing indicator** - See when others are typing
- 👥 **Online users list** - Sidebar showing who's online
- 🕐 **Relative timestamps** - "2 minutes ago" format
- ✏️ **Username editing** - Change your name anytime
- 🌙 **Dark mode** - Light/Dark theme toggle
- 😊 **Emoji picker** - 88 common emojis built-in
- ✅ **Input validation** - Server-side validation with DTOs
- 📦 **Type safety** - Shared types between backend and frontend

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd realtime-chat
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. Set up environment variables
```bash
# Backend - copy and modify if needed
cp backend/.env.example backend/.env

# Frontend - copy and modify if needed
cp frontend/.env.example frontend/.env.local
```

### Running the Application

**Development Mode (Recommended):**
```bash
# From root directory - runs both backend and frontend
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

**Production Mode:**
```bash
npm start
```

### Access the Application

- Frontend: http://localhost:3000
- Backend: http://localhost:3006

## 📁 Project Structure

```
realtime-chat/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── chat/           # WebSocket gateway
│   │   │   └── chat.gateway.ts
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── ...
│   ├── .env                # Backend environment variables
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   │   ├── page.tsx   # Main chat page
│   │   │   └── layout.tsx
│   │   └── Chat/          # Chat components
│   │       ├── ChatInput.tsx
│   │       └── ChatMessage.tsx
│   ├── .env.local         # Frontend environment variables
│   └── package.json
│
├── PROJECT_ANALYSIS.md    # Detailed project analysis
└── package.json           # Root package.json (dev scripts)
```

## Technologies Used

### Frontend

- **Next.js 15**: A React framework for building server-side rendered and statically generated web applications.
- **React 19**: JavaScript library for building user interfaces
- **Mantine 7**: A React component library for building modern web applications.
- **Socket.IO Client**: A library for real-time web applications to communicate with the backend.
- **TypeScript**: Type-safe JavaScript

### Backend

- **NestJS 10**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Socket.IO**: A library for real-time web applications to handle WebSocket connections.
- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework for Node.js

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=3006
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3006
NEXT_PUBLIC_SOCKET_URL=http://localhost:3006
```

## Logic of the Project

### Backend

The backend is built using NestJS and Socket.IO. It consists of the following main components:

- **AppController**: Handles HTTP requests.
- **AppService**: Contains the business logic.
- **ChatGateway**: Handles WebSocket connections and messages.

The `ChatGateway` class is responsible for:
- Initializing the WebSocket server
- Handling client connections and disconnections
- Broadcasting messages to all connected clients
- Storing and serving message history (last 100 messages)
- Managing real-time communication

### Frontend

The frontend is built using Next.js and Mantine. It consists of the following main components:

- **Home Component** (`page.tsx`): The main component that renders the chat interface.
- **ChatInput Component**: A form for sending messages with Enter key support.
- **ChatMessage Component**: Renders individual messages with user identification.

The `Home` component:
- Establishes a WebSocket connection to the backend using Socket.IO Client
- Manages user identity (userId and username) via localStorage
- Listens for incoming messages and updates the state accordingly
- Handles connection status and errors
- Auto-scrolls to the latest message
- Loads message history on connection

## Real-time Communication

The real-time communication between the frontend and backend is handled using Socket.IO:

1. **Connection**: When a user opens the app, a WebSocket connection is established
2. **User Identity**: Each user gets a unique UUID stored in localStorage
3. **Message History**: On connection, the user receives the last 100 messages
4. **Sending Messages**: When a user sends a message, it's emitted to the backend
5. **Broadcasting**: The backend broadcasts the message to all connected clients
6. **Display**: All users see the new message in real-time with proper formatting

## 📊 Recent Improvements (Oct 27, 2025)

### Morning Session ☀️
✅ Fixed critical socket listener bug  
✅ Added environment variables support  
✅ Implemented user identification system  
✅ Created modern message UI with bubbles  
✅ Added message history (in-memory)  
✅ Implemented auto-scroll functionality  
✅ Added connection status indicator  
✅ Fixed memory leaks  
✅ Improved error handling  

### Afternoon Session �
✅ **Typing indicator** - Real-time typing status  
✅ **Online users list** - Live sidebar with active users  
✅ **Relative timestamps** - User-friendly time display  
✅ **Username editing** - Modal-based name changes  
✅ **Dark mode** - Complete theme system  

### Evening Session 🌙
✅ **Shared types** - Type-safe communication layer  
✅ **Input validation** - class-validator with DTOs  
✅ **Emoji picker** - 88 common emojis built-in  

**Total: 18 Major Features Implemented** 🎉

For detailed analysis and future improvements, see [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Run both backend and frontend in dev mode
npm run backend      # Run only backend
npm run frontend     # Run only frontend

# Production
npm start            # Run both in production mode
npm run backend:prod # Run only backend in production
npm run frontend:prod # Run only frontend in production

# Utilities
npm run kill-ports   # Kill processes on ports 3000 and 3006
```

## 📝 License

UNLICENSED (Private Project)

## 🤝 Contributing

This is a personal project. If you'd like to contribute, please fork the repository and create a pull request.

---

**Built with ❤️ using Next.js and NestJS**
