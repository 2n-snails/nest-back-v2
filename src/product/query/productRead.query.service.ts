import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from 'src/entity/comment.entity';
import { Product } from 'src/entity/product.entity';
import { State } from 'src/entity/state.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ProductReadService {
  async findSellerProduct(product_no: number) {
    const seller = await getRepository(Product)
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.user', 'u')
      .select()
      .where('p.product_no = :value', { value: product_no })
      .getOne();
    return seller;
  }

  async findProducts(query: any) {
    const { page, limit, parent, child, title } = query;
    const total_count = await this.productTotalCount(query);
    const total_page = Math.ceil(total_count / limit);
    const index = (page - 1) * limit;
    const products = getRepository(Product)
      .createQueryBuilder('p')
      .select([
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_price',
        'p.product_view',
        'p.createdAt',
      ])
      .addSelect(['state.state_no', 'state.state'])
      .addSelect(['img.image_no', 'img.image_src', 'img.image_order'])
      .addSelect(['pc.product_category_no'])
      .addSelect(['deal.deal_no'])
      .leftJoin('p.state', 'state')
      .leftJoin('p.images', 'img', 'img.deleted = :value', { value: 'N' })
      .leftJoin('p.deals', 'deal', 'deal.deleted = :value', { value: 'N' })
      .leftJoinAndSelect('deal.addressArea', 'area')
      .leftJoinAndSelect('area.addressCity', 'city')
      .loadRelationCountAndMap('p.wish_count', 'p.wishes', 'wish_count', (qb) =>
        qb.where('wish_count.deleted = :value', { value: 'N' }),
      )
      .loadRelationCountAndMap(
        'p.comment_count',
        'p.comments',
        'comment_count',
        (qb) => qb.where('comment_count.deleted = :value', { value: 'N' }),
      )
      .leftJoin('p.productCategories', 'pc', 'pc.deleted = :value', {
        value: 'N',
      })
      .leftJoinAndSelect('pc.category', 'category')
      .where('p.deleted = :value', { value: 'N' });
    if (parent || child || title) {
      if (parent) {
        products.andWhere(`category.category_parent_name like '%${parent}%'`);
      } else if (child) {
        products.andWhere(`category.category_child_name like '%${child}%'`);
      } else {
        products.andWhere(`p.product_title like '%${title}%'`);
      }
    }
    const data = await products
      .skip(index)
      .take(limit)
      .orderBy('p.createdAt', 'DESC')
      .getMany();
    const next_page = page < total_page ? Number(page) + 1 : null;
    const prev_page = page <= total_page && page > 1 ? Number(page) - 1 : null;
    return { data, next_page, prev_page, total_count, total_page };
  }

  async productTotalCount(query: any): Promise<number> {
    const { parent, child, title } = query;
    const count = await getRepository(Product)
      .createQueryBuilder('p')
      .where('p.deleted = :value', { value: 'N' });
    if (parent || child || title) {
      count
        .leftJoin('p.productCategories', 'pc', 'pc.deleted = :value', {
          value: 'N',
        })
        .leftJoin('pc.category', 'c');
      if (parent) {
        count.andWhere(`c.category_parent_name like '%${parent}%'`);
      } else if (child) {
        count.andWhere(`c.category_child_name like '%${child}%'`);
      } else {
        count.andWhere(`p.product_title like '%${title}%'`);
      }
    }
    const data = count.getCount();
    return data;
  }

  async search(query: any) {
    return await this.findProducts(query);
  }

  async findOneProduct(product_id: number): Promise<Product> {
    return await getRepository(Product)
      .createQueryBuilder('p')
      .select([
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_price',
        'p.product_view',
        'p.createdAt',
      ])
      .addSelect(['u.user_no', 'u.user_nick', 'u.user_profile_image'])
      .addSelect(['state.state_no', 'state.state'])
      .addSelect(['img.image_no', 'img.image_src', 'img.image_order'])
      .addSelect(['pc.product_category_no'])
      .addSelect(['deal.deal_no'])
      .leftJoin('p.user', 'u')
      .leftJoin('p.state', 'state')
      .leftJoin('p.images', 'img', 'img.deleted = :value', { value: 'N' })
      .leftJoin('p.deals', 'deal', 'deal.deleted = :value', { value: 'N' })
      .leftJoinAndSelect('deal.addressArea', 'area')
      .leftJoinAndSelect('area.addressCity', 'city')
      .leftJoin('p.productCategories', 'pc', 'pc.deleted = :value', {
        value: 'N',
      })
      .leftJoinAndSelect('pc.category', 'category')
      .loadRelationCountAndMap('p.wish_count', 'p.wishes', 'wish_count', (qb) =>
        qb.where('wish_count.deleted = :value', { value: 'N' }),
      )
      .loadRelationCountAndMap(
        'p.comment_count',
        'p.comments',
        'comment_count',
        (qb) => qb.where('comment_count.deleted = :value', { value: 'N' }),
      )
      .where(`p.product_no = ${product_id}`)
      .getOne();
  }

  async findAllProductComment(product_id: number): Promise<Comment[]> {
    return await getRepository(Comment)
      .createQueryBuilder('c')
      .select(['c.comment_no', 'c.comment_content', 'c.createdAt'])
      .addSelect(['re.recomment_no', 're.recomment_content', 're.createdAt'])
      .leftJoin('c.recomments', 're', 're.deleted = :value', { value: 'N' })
      .where('c.deleted = :value', { value: 'N' })
      .andWhere(`c.product = ${product_id}`)
      .getMany();
  }

  async findProductWishListData(
    product_id: number,
    user_no: number,
  ): Promise<Wish> {
    try {
      return await getRepository(Wish)
        .createQueryBuilder('w')
        .select()
        .where('w.product = :product_no', { product_no: product_id })
        .andWhere('w.user = :user_no', { user_no })
        .getOne();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findProductStateData(product_id: number): Promise<State> {
    try {
      return await getRepository(State)
        .createQueryBuilder('s')
        .select(['s.state'])
        .where('s.product = :product_id', { product_id })
        .getOne();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
