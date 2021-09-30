import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(4000, {
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): void {
    console.log(data);

    this.server.emit('message', data);
  }
}
