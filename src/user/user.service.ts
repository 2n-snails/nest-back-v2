import { UpdateUserNickDto } from './dto/updateUserNick.dto';
import { UserDeleteService } from './query/userDelete.query.service';
import { UserUpdateService } from './query/userUpdate.query.service';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UserCreateService } from './query/userCreate.query.service';
import { UserReadService } from './query/userRead.query.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userCreateService: UserCreateService,
    private readonly userReadService: UserReadService,
    private readonly userUpdateService: UserUpdateService,
    private readonly userDeleteService: UserDeleteService,
  ) {}
  async findUserById(id: number | string): Promise<User | undefined> {
    return await this.userReadService.findOneUserById(id);
  }

  async findUserByUserNo(user_no: number | string): Promise<User | undefined> {
    return await this.userReadService.findOneUserByUserNo(user_no);
  }

  async joinUser(id: number | string, nick: string, provider: string) {
    return await this.userCreateService.createUser(id, nick, provider);
  }

  async findMyInfo(user_no: number): Promise<User | undefined> {
    return await this.userReadService.findMyInfoData(user_no);
  }

  async userProfileImageUpdate(user_no: number, image: string) {
    const result = await this.userUpdateService.userProfileImageUpdateData(
      user_no,
      image,
    );
    if (result.affected) {
      return { success: true, message: '프로필 사진 업데이트 성공' };
    } else {
      return { success: false, message: '프로필 사진 업데이트 실패' };
    }
  }

  async userNickUpdate(user_no: number, userNick: string) {
    const result = await this.userUpdateService.userNickUpdateData(
      user_no,
      userNick,
    );
    if (result.affected) {
      return { success: true, message: '닉네임 업데이트 성공' };
    } else {
      return { success: false, message: '닉네임 업데이트 실패' };
    }
  }
}
