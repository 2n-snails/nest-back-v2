import { Injectable } from '@nestjs/common';
import { Comment } from 'src/entity/comment.entity';
import { Deal } from 'src/entity/deal.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository, QueryRunner } from 'typeorm';

@Injectable()
export class ProductDeleteService {
  async deleteProductData(product_no: number, query_runner: QueryRunner) {
    return await query_runner.manager.update(Product, product_no, {
      deleted: 'Y',
    });
  }

  async deleteProductImageData(product_no: number, query_runner: QueryRunner) {
    return await query_runner.manager.update(
      Image,
      { product: product_no },
      { deleted: 'Y' },
    );
  }

  async deleteProductCategoryData(
    product_no: number,
    query_runner: QueryRunner,
  ) {
    return await query_runner.manager.update(
      ProductCategory,
      { product: product_no },
      { deleted: 'Y' },
    );
  }

  async deleteProductDealData(product_no: number, query_runner: QueryRunner) {
    return await query_runner.manager.update(
      Deal,
      { product: product_no },
      { deleted: 'Y' },
    );
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
