import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto, TypingEventDto, UserJoinedDto } from './dto/chat.dto';

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: number;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // In-memory message storage
  private messageHistory: ChatMessage[] = [];
  private readonly MAX_MESSAGES = 100; // Son 100 mesajı sakla

  // Online users tracking
  private onlineUsers: Map<string, { socketId: string; username: string; userId: string }> = new Map();

  afterInit(): void {
    console.log('✅ WebSocket Sunucusu başlatıldı');
  }

  handleConnection(client: Socket): void {
    console.log(`✅ Client bağlandı: ${client.id}`);
    
    // Yeni bağlanan kullanıcıya mesaj geçmişini gönder
    if (this.messageHistory.length > 0) {
      client.emit('messageHistory', this.messageHistory);
      console.log(`📤 ${this.messageHistory.length} mesaj geçmişi gönderildi: ${client.id}`);
    }

    // Online kullanıcı listesini gönder
    const userList = Array.from(this.onlineUsers.values()).map(u => ({
      userId: u.userId,
      username: u.username
    }));
    client.emit('onlineUsers', userList);
  }

  handleDisconnect(client: Socket): void {
    console.log(`❌ Client ayrıldı: ${client.id}`);
    
    // Ayrılan kullanıcıyı bul ve kaldır
    let disconnectedUser = null;
    for (const [userId, userData] of this.onlineUsers.entries()) {
      if (userData.socketId === client.id) {
        disconnectedUser = { userId, username: userData.username };
        this.onlineUsers.delete(userId);
        break;
      }
    }
    
    if (disconnectedUser) {
      // Güncel kullanıcı listesini tüm clientlara gönder
      const userList = Array.from(this.onlineUsers.values()).map(u => ({
        userId: u.userId,
        username: u.username
      }));
      this.server.emit('onlineUsers', userList);
      console.log(`👥 Online kullanıcı sayısı: ${this.onlineUsers.size}`);
    }
  }

  @SubscribeMessage('message')
  @UsePipes(new ValidationPipe({ transform: true }))
  handleMessage(@MessageBody() data: CreateMessageDto): void {
    console.log('📩 Mesaj alındı:', data);
    
    // Mesajı geçmişe ekle
    this.messageHistory.push(data);
    
    // Maksimum mesaj sayısını aşarsa eski mesajları sil
    if (this.messageHistory.length > this.MAX_MESSAGES) {
      this.messageHistory = this.messageHistory.slice(-this.MAX_MESSAGES);
    }
    
    // Mesajı tüm clientlara broadcast et
    this.server.emit('message', data);
  }

  @SubscribeMessage('typing')
  @UsePipes(new ValidationPipe({ transform: true }))
  handleTyping(@MessageBody() data: TypingEventDto): void {
    console.log('⌨️ Typing event:', data);
    // Typing event'ini diğer tüm clientlara gönder
    this.server.emit('userTyping', data);
  }

  @SubscribeMessage('userJoined')
  @UsePipes(new ValidationPipe({ transform: true }))
  handleUserJoined(
    @MessageBody() data: UserJoinedDto,
    @ConnectedSocket() client: Socket
  ): void {
    console.log('👋 Kullanıcı katıldı:', data);
    
    // Kullanıcıyı online listesine ekle
    this.onlineUsers.set(data.userId, {
      socketId: client.id,
      userId: data.userId,
      username: data.username
    });
    
    // Güncel kullanıcı listesini tüm clientlara gönder
    const userList = Array.from(this.onlineUsers.values()).map(u => ({
      userId: u.userId,
      username: u.username
    }));
    this.server.emit('onlineUsers', userList);
    console.log(`👥 Online kullanıcı sayısı: ${this.onlineUsers.size}`);
  }
}