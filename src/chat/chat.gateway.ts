import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

// 특정 사용자 끼리만 채팅이 가능하도록 설계
@WebSocketGateway(8000, {
  cors: {
    origin: 'http://localhost:4000',
  },
  transports: ['websocket'],
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): void {
    console.log(data);

    this.server.emit('message', data);
  }
}
