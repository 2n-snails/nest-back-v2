import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { Any } from 'typeorm';
import { ChatService } from './chat.service';

// 특정 사용자 끼리만 채팅이 가능하도록 설계
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}
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
  @SubscribeMessage('sendMessage')
  handleEvent(@MessageBody() data: string): void {
    // this.server.emit('message', data);
    console.log(data);
    const [message, chat_no] = data;
    this.server.to(chat_no).emit('onMessage', message);
  }

  @SubscribeMessage('createNewChatRoom')
  async createRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { seller, buyer, product } = data;
    const chat_room = await this.chatService.findOneChatRoom(seller, buyer);
    const seller_name = await this.userService.findUserByUserNo(seller);
    const buyer_name = await this.userService.findUserByUserNo(buyer);
    if (!chat_room) {
      // //디비에 새로운 채팅방 정보 넣기
      const new_chat = await this.chatService.createNewCaht(
        seller,
        buyer,
        product,
      );
      console.log(new_chat);
      client.join(`${new_chat.chat_no}`);

      // 새로운 채팅 목록 프론트로 보내기
      // 만든사람: 구매 희망유저, 받는사람: 판매자
      this.server.to(client.id).emit('chatRoomMadeByMe', {
        room_name: seller_name.user_nick,
        room_no: new_chat.chat_no,
      });

      const connected_user = await this.chatService.findConnectedUser(seller);

      if (connected_user) {
        this.server
          .to(connected_user.client_id)
          .emit('chatRoomMadeByOhterUser', {
            room_name: buyer_name.user_nick,
            room_no: new_chat.chat_no,
          });
      }
    } else {
      client.join(`${chat_room.chat_no}`);
      console.log(client.rooms);
    }
  }

  // 대화목록 창에서 클릭하면 바로 룸을 생성하고 룸이 생성되있다면 룸으로 넣어준다.
  @SubscribeMessage('joinRoom')
  async joinRooms(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // data === chat_no;
    console.dir(client.rooms);
    console.log(client.rooms.has(data));
    client.join(data);
    console.dir(client.rooms);
  }
}
