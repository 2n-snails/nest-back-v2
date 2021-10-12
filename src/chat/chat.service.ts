import { Chat } from './../entity/chat.entity';
import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

@Injectable()
export class ChatService {
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
}
