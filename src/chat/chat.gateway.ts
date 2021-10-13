import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { onlineMap } from './onlineMap';

// 특정 사용자 끼리만 채팅이 가능하도록 설계
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`my id is ${client.id}`);
    onlineMap.push(client.id);
    console.log('connected');
  }
  handleDisconnect(client: any) {
    // console.log(client);
    console.log('disconnected');
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): void {
    this.server.emit('message', data);
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() data: string): void {
    this.server.emit('message', data);
  }
}
