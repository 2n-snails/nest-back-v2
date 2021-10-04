import { Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import { State } from 'src/entity/state.entity';
import { User } from 'src/entity/user.entity';
import { getRepository, QueryRunner } from 'typeorm';
import { UpdateProductDto } from '../dto/updateProduct.dto';

@Injectable()
export class ProductUpdateService {
  async productUpdateData(
    data: UpdateProductDto,
    product_no: number,
    query_runner: QueryRunner,
  ) {
    const { product_title, product_content, product_price } = data;
    return await query_runner.manager.update(Product, product_no, {
      product_title,
      product_content,
      product_price,
    });
  }

  async productStateUpdateData(product_no: number, state: string, user?: User) {
    const qb = getRepository(State).createQueryBuilder().update();
    if (user) {
      qb.set({ state, user });
    } else {
      if (state === 'sale') {
        qb.set({ state, user: null });
      } else {
        qb.set({ state });
      }
    }

    return qb.where('product = :value', { value: product_no }).execute();
  }
}
