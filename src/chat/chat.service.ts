import { Chat } from './../entity/chat.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { getManager, getRepository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SocketClient } from 'src/entity/socket.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async findAll(id: number): Promise<Chat[]> {
    // 이게 유저 번호기준으로 seller or buyer에 값이 있을때 찾는건데 목록 찾고 내가 아닌 다른 사람 이름까지 조회해야 채팅방 이름을 보여줄수 있을듯
    // const result = await getRepository(Chat)
    //   .createQueryBuilder('chat')
    //   .where(`chat.seller = :seller OR chat.buyer = :buyer`, {
    //     seller: id,
    //     buyer: id,
    //   })
    //   .getRawMany();
    // return result;
    const manager = getManager();
    const result = await manager.query(`
    select * 
    from chat 
    inner join "user" on (chat.seller = ${id} and chat.buyer = "user".user_no) 
    or 
    chat.buyer = ${id} and chat.seller = "user".user_no 
    where chat.seller = ${id} or chat.buyer = ${id}`);
    return result;
  }

  async findOne(roomId: number): Promise<Chat[]> {
    const result = await getRepository(Chat)
      .createQueryBuilder('chat')
      .where(`chat.chat_no = :chat_no`, { chat_no: roomId })
      .getRawMany();
    return result;
  }

  async findOneChatRoom(user_no_1: number, user_no_2: number): Promise<Chat> {
    const result = await getRepository(Chat)
      .createQueryBuilder()
      .where(`seller = ${user_no_1} And buyer = ${user_no_2}`)
      .orWhere(`seller = ${user_no_2} And buyer = ${user_no_1}`)
      .getOne();
    return result;
  }

  async createNewCaht(seller: any, buyer: any, product: any) {
    const result = await getRepository(Chat).save({
      seller,
      buyer,
      product,
    });
    return result;
  }

  async socketRequest(header: any): Promise<User> {
    try {
      const token = header.replace('Bearer ', '');
      const token_verify = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = this.userService.findUserByUserNo(token_verify.user_no);
      return user;
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'jwt expired':
          throw new HttpException('만료된 토큰입니다.', 410);

        default:
          throw new HttpException('서버 오류.', 500);
      }
    }
  }

  async pushSocketServer(user_no: number, client_id: string) {
    return await getRepository(SocketClient).save({
      client_id,
      user_no,
    });
  }

  async deleteSocketServer(client_id: string) {
    return await getRepository(SocketClient).delete({ client_id });
  }

  async findConnectedUser(user_no: number): Promise<SocketClient> {
    const result = await getRepository(SocketClient)
      .createQueryBuilder()
      .where(`user_no = ${user_no}`)
      .getOne();
    return result;
  }
}
