import { HttpException, Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import { User } from 'src/entity/user.entity';
import { ProductCreateService } from './query/productCreate.query.service';
import { ProductDeleteService } from './query/productDelete.query.service';
import { ProductReadService } from './query/productRead.query.service';
import { ProductUpdateService } from './query/productUpdate.query.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productCreateService: ProductCreateService,
    private readonly productReadService: ProductReadService,
    private readonly productUpdateService: ProductUpdateService,
    private readonly productDeleteService: ProductDeleteService,
  ) {}
  async getMainPageData(query: any) {
    const data = await this.productReadService.findProducts(query);
    return data;
  }

  async createProduct(user_no: number, data: any) {
    const { product_title, product_content, product_price } = data;
    const product = await this.productCreateService.createProduct(
      product_title,
      product_content,
      product_price,
      user_no,
    );

    await this.productCreateService.createProductImage(data.image, product);
    await this.productCreateService.createProductCategory(
      data.category,
      product,
    );
    await this.productCreateService.createProductDeal(data.deal, product);
    await this.productCreateService.createProductState(product);
    return true;
  }

  async modifyProduct(user: User, data: any, product_id: number) {
    const product = await this.productReadService.findSellerProduct(product_id);
    if (user.user_no !== product.user.user_no) {
      return false;
    }
    // product 테이블 관련 데이터 deleted 값 변경으로 삭제 처리
    await this.productDeleteService.deleteProductImage(product_id);
    await this.productDeleteService.deleteProductCategory(product_id);
    await this.productDeleteService.deleteProductDeal(product_id);
    // product 테이블 값 변경, 이미지, 거래지역, 카테고리 데이터 생성
    await this.productUpdateService.productUpdate(data, product_id);
    await this.productCreateService.createProductImage(data.image, product);
    await this.productCreateService.createProductCategory(
      data.category,
      product,
    );
    await this.productCreateService.createProductDeal(data.deal, product);
    return true;
  }

  async deleteProduct(user: User, product_id: number) {
    const product = await this.productReadService.findSellerProduct(product_id);
    if (user.user_no !== product.user.user_no) {
      return false;
    }
    await this.productDeleteService.deleteProduct(product_id);
    await this.productDeleteService.deleteProductImage(product_id);
    await this.productDeleteService.deleteProductCategory(product_id);
    await this.productDeleteService.deleteProductDeal(product_id);
    await this.productUpdateService.productStateUpdate(product_id, 'delete');
    // TODO: 채팅방 구현시 채팅방도 삭제?
    return true;
  }
}
