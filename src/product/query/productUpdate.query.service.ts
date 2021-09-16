import { Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import { State } from 'src/entity/state.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ProductUpdateService {
  async productUpdate(data: any, product_no: number) {
    const { product_title, product_content, product_price } = data;
    return await getRepository(Product)
      .createQueryBuilder()
      .update()
      .set({
        product_title,
        product_content,
        product_price,
      })
      .where('product_no = :value', { value: product_no })
      .execute();
  }

  async productStateUpdate(product_no: number, state: string) {
    return await getRepository(State)
      .createQueryBuilder()
      .update()
      .set({ state })
      .where('product = :value', { value: product_no })
      .execute();
  }
}
