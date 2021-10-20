import { Chat } from './../entity/chat.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
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
    const result = await getRepository(Chat)
      .createQueryBuilder('chat')
      .where(`chat.seller = :seller OR chat.buyer = :buyer`, {
        seller: id,
        buyer: id,
      })
      .getRawMany();
    return result;
  }

  async findOne(roomId: number): Promise<Chat[]> {
    const result = await getRepository(Chat)
      .createQueryBuilder('chat')
      .where(`chat.chat_no = :chat_no`, { chat_no: roomId })
      .getRawMany();
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
}
