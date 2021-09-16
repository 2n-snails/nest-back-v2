import { Injectable } from '@nestjs/common';
import { ProductCreateService } from './query/productCreate.query.service';

@Injectable()
export class ProductService {
  constructor(private readonly productCreateService: ProductCreateService) {}
  async createProduct(user_no: number, data: any) {
    const { product_title, product_content, product_price } = data;
    const product_image = data.image;
    const product_category = data.category;
    const deal = data.deal;
    const product = await this.productCreateService.createProduct(
      product_title,
      product_content,
      product_price,
      user_no,
    );

    await this.productCreateService.createProductImage(product_image, product);
    await this.productCreateService.createProductCategory(
      product_category,
      product,
    );
    await this.productCreateService.createProductDeal(deal, product);
    await this.productCreateService.createProductState(product);
    return true;
  }
}
