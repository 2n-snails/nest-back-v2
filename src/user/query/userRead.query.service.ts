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

  async findUserProductData(user_id: number, state: string): Promise<User[]> {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.products', 'p')
      .leftJoinAndSelect('p.state', 'state')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.comments', 'comment')
      .leftJoinAndSelect('p.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .select([
        'u.user_no',
        'u.user_profile_image',
        'u.user_nick',
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_view',
        'state.state',
        'p.createdAt',
        'image.image_src',
        'image.image_order',
        'deal.deal_no',
        'addressArea.area_name',
        'addressCity.city_name',
      ])
      .loadRelationCountAndMap(
        'p.commentCount',
        'p.comments',
        'commentCount',
        (qb) => qb.where(`commentCount.deleted = 'N'`),
      )
      .loadRelationCountAndMap(
        'p.productWishCount',
        'p.wishes',
        'productWish',
        (qb) => qb.where(`productWish.deleted = 'N'`),
      )
      .where(`u.user_no = ${user_id}`)
      .andWhere(`p.deleted = 'N'`)
      .andWhere('state.state = :state', { state })
      .getMany();
    return result;
  }

  async findUserWishProductData(user_id): Promise<User[]> {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.wishes', 'wish')
      .leftJoinAndSelect('wish.product', 'p')
      .leftJoinAndSelect('p.state', 'state')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.comments', 'comment')
      .leftJoinAndSelect('p.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .leftJoinAndSelect('p.user', 'seller')
      .select([
        'u.user_no',
        'wish.wish_no',
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_view',
        'state.state',
        'p.createdAt',
        'image.image_src',
        'image.image_order',
        'deal.deal_no',
        'addressArea.area_name',
        'addressCity.city_name',
        'seller.user_no',
        'seller.user_profile_image',
        'seller.user_nick',
      ])
      .loadRelationCountAndMap(
        'p.commentCount',
        'p.comments',
        'commentCount',
        (qb) => qb.where(`commentCount.deleted = 'N'`),
      )
      .loadRelationCountAndMap(
        'p.productWishCount',
        'p.wishes',
        'productWish',
        (qb) => qb.where(`productWish.deleted = 'N'`),
      )
      .loadRelationCountAndMap(
        'u.userWishCount',
        'u.wishes',
        'userWishCount',
        (qb) => qb.where(`userWishCount.deleted = 'N'`),
      )
      .where(`u.user_no = ${user_id}`)
      .andWhere(`wish.deleted = 'N'`)
      .andWhere(`p.deleted = 'N'`)
      .andWhere(`state.state = 'sale'`)
      .getMany();
    return result;
  }
}
