import { Injectable } from '@nestjs/common';
import { AddressArea } from 'src/entity/address_area.entity';
import { Category } from 'src/entity/category.entity';
import { Comment } from 'src/entity/comment.entity';
import { Deal } from 'src/entity/deal.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { State } from 'src/entity/state.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository } from 'typeorm';
import { CreateCommentDto } from '../dto/createComment.dto';
import { CreateProductDto } from '../dto/createProduct.dto';
import { CreateReCommentDto } from '../dto/createReComment.dto';

@Injectable()
export class ProductCreateService {
  async createProductData(
    product_title: string,
    product_content: string,
    product_price: string,
    user_no: any,
  ) {
    const product = await getRepository(Product).save({
      product_title,
      product_content,
      product_price,
      user: user_no,
    });
    return product;
  }

  async createProductImageData(
    data: CreateProductDto['image'],
    product: Product,
  ) {
    for (let i = 0; i < data.length; i++) {
      await getRepository(Image).save({
        image_src: data[i],
        image_order: i + 1,
        product,
      });
    }
    return true;
  }

  async createProductCategoryData(
    data: CreateProductDto['category'],
    product: Product,
  ) {
    for (let i = 0; i < data.length; i++) {
      const category = await getRepository(Category)
        .createQueryBuilder('c')
        .select()
        .where('c.category_parent_name = :parent', { parent: data[i].parent })
        .andWhere('c.category_child_name = :child', { child: data[i].child })
        .getOne();
      await getRepository(ProductCategory).save({
        category,
        product,
      });
    }
    return true;
  }

  async createProductStateData(product: Product) {
    await getRepository(State).save({ product, review_state: 'N' });
    return true;
  }

  async createProductDealData(
    data: CreateProductDto['deal'],
    product: Product,
  ) {
    for (let i = 0; i < data.length; i++) {
      const address = await getRepository(AddressArea)
        .createQueryBuilder('a')
        .select()
        .where('a.area_name = :name', { name: data[i] })
        .getOne();
      await getRepository(Deal).save({
        addressArea: address,
        product,
      });
    }
    return true;
  }

  async createWishData(product: any, user: any) {
    const result = await getRepository(Wish).save({
      user,
      product,
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async createCommentData(data: CreateCommentDto, user: any, product: any) {
    const { comment_content } = data;
    const result = await getRepository(Comment).save({
      comment_content,
      user,
      product,
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async createReCommentData(
    user: any,
    data: CreateReCommentDto,
    comment: any,
  ): Promise<ReComment> {
    const { recomment_content } = data;
    return await getRepository(ReComment).save({
      recomment_content,
      user,
      comment,
    });
  }
}
