import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from 'src/entity/comment.entity';
import { Deal } from 'src/entity/deal.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { User } from 'src/entity/user.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ProductDeleteService {
  async deleteProduct(product_no: Product['product_no']) {
    return await getRepository(Product)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('product_no = :value', { value: product_no })
      .execute();
  }

  async deleteProductImageData(product_no: Product['product_no']) {
    try {
      return await getRepository(Image)
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where('product = :value', { value: product_no })
        .execute();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProductCategoryData(product_no: Product['product_no']) {
    try {
      return await getRepository(ProductCategory)
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where('product = :value', { value: product_no })
        .execute();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProductDealData(product_no: Product['product_no']) {
    try {
      return await getRepository(Deal)
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where('product = :value', { value: product_no })
        .execute();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteWishData(
    product_no: Product['product_no'],
    user_no: User['user_no'],
  ) {
    try {
      return await getRepository(Wish)
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where('product = :product', { product: product_no })
        .andWhere('user = :user', { user: user_no })
        .execute();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCommentData(comment_no: Comment['comment_no']) {
    try {
      return await getRepository(Comment)
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where('comment_no = :comment_no', { comment_no })
        .execute();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteReCommentData(recomment_no: ReComment['recomment_no']) {
    try {
      return await getRepository(ReComment)
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where('recomment_no = :recomment_no', { recomment_no })
        .execute();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
