import { Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
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
}
