import { Injectable } from '@nestjs/common';
import { Comment } from 'src/entity/comment.entity';
import { Deal } from 'src/entity/deal.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ProductDeleteService {
  async deleteProduct(product_no: number) {
    return await getRepository(Product)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('product_no = :value', { value: product_no })
      .execute();
  }

  async deleteProductImage(product_no: number) {
    return await getRepository(Image)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('product = :value', { value: product_no })
      .execute();
  }

  async deleteProductCategory(product_no: number) {
    return await getRepository(ProductCategory)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('product = :value', { value: product_no })
      .execute();
  }

  async deleteProductDeal(product_no: number) {
    return await getRepository(Deal)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('product = :value', { value: product_no })
      .execute();
  }

  async deleteWishData(product_no: number, user_no: number) {
    return await getRepository(Wish)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('product = :product', { product: product_no })
      .andWhere('user = :user', { user: user_no })
      .execute();
  }

  async deleteCommentData(comment_no: number) {
    return await getRepository(Comment)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('comment_no = :comment_no', { comment_no })
      .execute();
  }

  async deleteReCommentData(recomment_no: number) {
    return await getRepository(ReComment)
      .createQueryBuilder()
      .update()
      .set({ deleted: 'Y' })
      .where('recomment_no = :recomment_no', { recomment_no })
      .execute();
  }
}
