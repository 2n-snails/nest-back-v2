import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class UserCreateService {
  async createUser(id: number | string, nick: string, provider: string) {
    return await getRepository(User)
      .createQueryBuilder()
      .insert()
      .values({
        user_provider_id: `${id}`,
        user_nick: nick,
        user_provider: provider,
      })
      .execute();
  }
}
