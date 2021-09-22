import { CreateReviewDto } from './dto/createReview.dto';
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

  async reviewWrite(
    writer: number,
    receiver: number,
    createReviewDto: CreateReviewDto,
  ) {
    const { content, reviewScore, product_no } = createReviewDto;
    const result = await this.userCreateService.reviewWriteData(
      writer,
      receiver,
      content,
      reviewScore,
      product_no,
    );
    if (result) {
      return { success: true, message: '후기 작성 성공' };
    }
  }
  async findUserReview(paramUserId: number): Promise<any> {
    const reviewData = await this.userReadService.findUserReviewData(
      paramUserId,
    );
    const user = await this.userReadService.findMyInfoData(paramUserId);
    const result = { user, reviewData };
    return result;
  }
  async findMyPage(userId: number, state: string) {
    const user = await this.userReadService.findMyInfoData(userId);
    const queryData = await this.userReadService.findUserProductData(
      userId,
      state,
    );
    return { user, queryData };
  }

  async logoutUser(userId: number) {
    const queryData = await this.userUpdateService.userLogoutData(userId);
    return queryData;
  }

  async deleteUser(userId: number) {
    const queryData = await this.userUpdateService.deleteUserData(userId);
    return queryData;
  }
}
