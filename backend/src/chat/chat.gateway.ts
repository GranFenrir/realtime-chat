import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(): void {
    console.log('WebSocket Sunucusu başlatıldı');
  }

  handleConnection(client: Socket): void {
    console.log(`Client bağlandı: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client ayrıldı: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: ChatMessage): void {
    console.log('Mesaj alındı:', data);
    this.server.emit('message', data);
  }
}