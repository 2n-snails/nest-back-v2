import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import { Comment } from 'src/entity/comment.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { State } from 'src/entity/state.entity';
import { User } from 'src/entity/user.entity';
import { Wish } from 'src/entity/wish.entity';
import { ProductCreateService } from './query/productCreate.query.service';
import { ProductDeleteService } from './query/productDelete.query.service';
import { ProductReadService } from './query/productRead.query.service';
import { ProductUpdateService } from './query/productUpdate.query.service';
import { MainPageDto } from './dto/mainpage.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Product } from 'src/entity/product.entity';
import { SearchDto } from './dto/search.dto';
import { ChangeProductStateDto } from './dto/chageProductState.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { CreateReCommentDto } from './dto/createReComment.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productCreateService: ProductCreateService,
    private readonly productReadService: ProductReadService,
    private readonly productUpdateService: ProductUpdateService,
    private readonly productDeleteService: ProductDeleteService,
    private readonly userService: UserService,
  ) {}
  async getMainPageData(query: MainPageDto) {
    const data = await this.productReadService.findProducts(query);
    return data;
  }

  async createProduct(user_no: User['user_no'], data: CreateProductDto) {
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

  async modifyProduct(
    user: User,
    data: UpdateProductDto,
    product_id: Product['product_no'],
  ) {
    // TODO: 밑에 3줄 삭제 예정
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

  async deleteProduct(user: User, product_id: Product['product_no']) {
    // TODO: 밑에 3줄 삭제 예정
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

  async searchProduct(query: SearchDto) {
    return await this.productReadService.search(query);
  }

  async findOneProduct(product_id: Product['product_no']) {
    const product = await this.productReadService.findOneProduct(product_id);
    // TODO: 댓글 목록 가져오기
    const comment = await this.productReadService.findAllProductComment(
      product_id,
    );
    // TODO: 판매자의 별점 구하기 -> 분리 안함
    return { product, comment };
  }

  async changeProductState(
    product_id: Product['product_no'],
    query: ChangeProductStateDto,
  ) {
    const { state, user_no } = query;
    const user = await this.userService.findUserByUserNo(user_no);
    const result = await this.productUpdateService.productStateUpdate(
      product_id,
      state,
      user,
    );
    return result.affected
      ? { success: true, message: '상품 상태 수정 성공' }
      : { success: false, message: '상품 상태 수정 실패' };
  }

  async findProductSeller(product_id: Product['product_no']) {
    return await this.productReadService.findSellerProduct(product_id);
  }

  async createWish(
    product_id: Product['product_no'],
    user: User['user_no'],
  ): Promise<Wish> {
    return await this.productCreateService.createWishData(product_id, user);
  }

  async deletedWish(product_id: Product['product_no'], user: User['user_no']) {
    return await this.productDeleteService.deleteWishData(product_id, user);
  }

  async checkProductState(product_id: Product['product_no']): Promise<State> {
    return await this.productReadService.findProductStateData(product_id);
  }

  async checkProductWishList(
    product_id: Product['product_no'],
    user_no: User['user_no'],
  ): Promise<Wish> {
    return await this.productReadService.findProductWishListData(
      product_id,
      user_no,
    );
  }

  async createComment(
    data: CreateCommentDto,
    user: User['user_no'],
    product_id: Product['product_no'],
  ): Promise<Comment> {
    return await this.productCreateService.createCommentData(
      data,
      user,
      product_id,
    );
  }

  async checkCommentWriter(comment_no: Comment['comment_no']) {
    return await this.productReadService.findCommentWriterData(comment_no);
  }

  async deleteComment(comment_no: Comment['comment_no']) {
    return await this.productDeleteService.deleteCommentData(comment_no);
  }

  async createReComment(
    user_no: User['user_no'],
    data: CreateReCommentDto,
    comment_no: Comment['comment_no'],
  ): Promise<ReComment> {
    return await this.productCreateService.createReCommentData(
      user_no,
      data,
      comment_no,
    );
  }

  async checkReComment(
    recomment_no: ReComment['recomment_no'],
  ): Promise<ReComment> {
    return await this.productReadService.findReCommentData(recomment_no);
  }

  async deleteReComment(recomment_no: ReComment['recomment_no']) {
    return await this.productDeleteService.deleteReCommentData(recomment_no);
  }
}
