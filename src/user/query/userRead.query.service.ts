import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class UserReadService {
  async findOneUserById(id: number | string): Promise<User | undefined> {
    return await getRepository(User)
      .createQueryBuilder('u')
      .where(`user_provider_id = :provider_id`, { provider_id: id })
      .getOne();
  }

  async findOneUserByUserNo(
    user_no: number | string,
  ): Promise<User | undefined> {
    return await getRepository(User)
      .createQueryBuilder('u')
      .where(`user_no = :user_no`, { user_no: user_no })
      .getOne();
  }
}
