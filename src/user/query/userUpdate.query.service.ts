import { User } from './../../entity/user.entity';
import { getRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserUpdateService {
  async userProfileImageUpdateData(user_no: number, image: string) {
    const result = await getRepository(User)
      .createQueryBuilder()
      .update({
        user_profile_image: image,
      })
      .where(`user_no = ${user_no}`)
      .execute();
    return result;
  }

  async userNickUpdateData(user_no: number, userNick: string) {
    const result = await getRepository(User)
      .createQueryBuilder()
      .update({
        user_nick: userNick,
      })
      .where(`user_no = ${user_no}`)
      .execute();
    return result;
  }
}
