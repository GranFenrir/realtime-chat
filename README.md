# Real-time Chat Application

This is a real-time chat application built with Next.js for the frontend and NestJS for the backend. It uses Socket.IO for real-time communication.

## Technologies Used

### Frontend

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **Mantine**: A React component library for building modern web applications.
- **Socket.IO Client**: A library for real-time web applications to communicate with the backend.

### Backend

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Socket.IO**: A library for real-time web applications to handle WebSocket connections.

## Logic of the Project

### Backend

The backend is built using NestJS and Socket.IO. It consists of the following main components:

- **AppController**: Handles HTTP requests.
- **AppService**: Contains the business logic.
- **ChatGateway**: Handles WebSocket connections and messages.

The `ChatGateway` class is responsible for initializing the WebSocket server, handling client connections and disconnections, and broadcasting messages to all connected clients.

### Frontend

The frontend is built using Next.js and Mantine. It consists of the following main components:

- **Home Component**: The main component that renders the chat interface.
- **ChatInput Component**: A form for sending messages.

The `Home` component establishes a WebSocket connection to the backend using Socket.IO Client. It listens for incoming messages and updates the state accordingly. The `ChatInput` component allows users to type and send messages, which are then emitted to the backend via the WebSocket connection.

## Real-time Communication

The real-time communication between the frontend and backend is handled using Socket.IO. When a user sends a message from the frontend, it is emitted to the backend via a WebSocket connection. The backend then broadcasts the message to all connected clients, ensuring that all users see the new message in real-time.
