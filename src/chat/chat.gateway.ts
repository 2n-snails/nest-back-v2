import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

// 특정 사용자 끼리만 채팅이 가능하도록 설계
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

  // 소켓 연결시
  async handleConnection(client: any) {
    const user = await this.chatService.socketRequest(
      client.handshake.auth.token,
    );
    await this.chatService.pushSocketServer(user.user_no, client.id);
    console.log('connected');
  }
  // 소켓 연결 해제시
  async handleDisconnect(client: any) {
    await this.chatService.deleteSocketServer(client.id);
    console.log('disconnected');
  }

  // TODO: 새로운 채팅방 열릴 때
  // TODO: 열려있는 채팅방에 들어갈때
  // TODO: 유저 둘 끼리 메시지 보내주기
  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): void {
    this.server.emit('message', data);
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() data: string): void {
    this.server.emit('message', data);
  }
}
