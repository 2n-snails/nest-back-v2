import { Review } from './../../entity/review.entity';
import { CreateReviewDto } from './../dto/createReview.dto';
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
        user_nick: `${nick}`,
        user_provider: provider,
      })
      .execute();
  }

  async reviewWriteData(
    writer: any,
    receiver: any,
    content: string,
    reviewScore: number,
    product_no: number,
  ) {
    try {
      const result = await getRepository(Review)
        .createQueryBuilder()
        .insert()
        .values({
          product_no,
          writer,
          receiver,
          review_content: content,
          review_score: reviewScore,
        })
        .execute();
      return result;
    } catch (error) {
      return { success: false, message: '서버 오류' };
    }
  }
}
