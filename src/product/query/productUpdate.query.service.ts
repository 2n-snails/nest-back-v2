import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import { State } from 'src/entity/state.entity';
import { User } from 'src/entity/user.entity';
import { getRepository } from 'typeorm';
import { ChangeProductStateDto } from '../dto/chageProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';

@Injectable()
export class ProductUpdateService {
  async productUpdateData(
    data: UpdateProductDto,
    product_no: Product['product_no'],
  ) {
    try {
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
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async productStateUpdateData(
    product_no: Product['product_no'],
    state: ChangeProductStateDto['state'],
    user?: User,
  ) {
    try {
      const qb = getRepository(State).createQueryBuilder().update();
      user ? qb.set({ state, user }) : qb.set({ state });
      return qb.where('product = :value', { value: product_no }).execute();
    } catch (e) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
