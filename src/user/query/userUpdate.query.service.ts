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

  async userLogoutData(user_no: number) {
    const result = await getRepository(User)
      .createQueryBuilder()
      .update({
        user_refresh_token: 'none',
      })
      .where(`user_no = ${user_no}`)
      .execute();
    return result;
  }

  async deleteUserData(user_no: number) {
    const result = await getRepository(User)
      .createQueryBuilder()
      .update({
        deleted: 'Y',
      })
      .where(`user_no = ${user_no}`)
      .execute();
    return result;
  }

  async userRefreshTokenUpdateData(token: string, user_no: number) {
    return await getRepository(User)
      .createQueryBuilder()
      .update()
      .set({ user_refresh_token: token })
      .where(`user_no = ${user_no}`)
      .execute();
  }
}
