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

  async findMyInfoData(user_no: number): Promise<User> {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.review_receiver', 'review')
      .select([
        'u.user_no',
        'u.user_profile_image',
        'u.user_nick',
        'u.user_provider',
        'u.createdAt',
      ])
      // 소수점 둘째 자리까지
      .addSelect('AVG(review.review_score)::numeric(10,2)', 'reviewAvg')
      .where(`u.user_no = ${user_no}`)
      .groupBy('u.user_no')
      .getRawOne();
    return result;
  }
  async findUserReviewData(paramUserId: number): Promise<User[] | undefined> {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.review_receiver', 'review')
      .leftJoinAndSelect('review.writer', 'reviewWriter')
      .where(`u.user_no = ${paramUserId}`)
      .select([
        'u.user_no',
        'review.product_no',
        'review.review_content',
        'review.createdAt',
        'reviewWriter.user_no',
        'reviewWriter.user_profile_image',
        'reviewWriter.user_nick',
      ])
      .getMany();
    return result;
  }
}
