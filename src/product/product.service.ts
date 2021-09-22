import { Injectable } from '@nestjs/common';
import { ReComment } from 'src/entity/recomment.entity';
import { Comment } from 'src/entity/comment.entity';
import { State } from 'src/entity/state.entity';
import { User } from 'src/entity/user.entity';
import { Wish } from 'src/entity/wish.entity';
import { UserService } from 'src/user/user.service';
import { ProductCreateService } from './query/productCreate.query.service';
import { ProductDeleteService } from './query/productDelete.query.service';
import { ProductReadService } from './query/productRead.query.service';
import { ProductUpdateService } from './query/productUpdate.query.service';
import { MainPageDto } from './dto/mainpage.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { SearchDto } from './dto/search.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductIdParamDto } from './dto/product.param.dto';
import { CommentIdParamDto } from './dto/comment.param.dto';
import { ReCommentIdParamDto } from './dto/recomment.param.dto';
import { ChangeProductStateDto } from './dto/chageProduct.dto';
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
  // 메인 페이지 상품 데이터 받기
  async getMainPageData(query: MainPageDto) {
    return await this.productReadService.findProducts(query);
  }

  // 상품 업로드 하기
  async createProduct(user_no: number, data: CreateProductDto) {
    const { product_title, product_content, product_price } = data;
    const product = await this.productCreateService.createProductData(
      product_title,
      product_content,
      product_price,
      user_no,
    );

    await this.productCreateService.createProductImageData(data.image, product);
    await this.productCreateService.createProductCategoryData(
      data.category,
      product,
    );
    await this.productCreateService.createProductDealData(data.deal, product);
    await this.productCreateService.createProductStateData(product);
    return true;
  }

  // 상품 수정하기
  async modifyProduct(
    user: User,
    data: UpdateProductDto,
    product_id: ProductIdParamDto['product_id'],
  ) {
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
    await this.productCreateService.createProductImageData(data.image, product);
    await this.productCreateService.createProductCategoryData(
      data.category,
      product,
    );
    await this.productCreateService.createProductDealData(data.deal, product);
    return true;
  }

  // 상품 삭제하기
  async deleteProduct(user: User, product_id: ProductIdParamDto['product_id']) {
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

  // 상품 검색하기
  async searchProduct(query: SearchDto) {
    return await this.productReadService.search(query);
  }

  // 상품 상세정보 받기
  async findOneProduct(product_id: ProductIdParamDto['product_id']) {
    const product = await this.productReadService.findOneProduct(product_id);
    // TODO: 댓글 목록 가져오기
    const comment = await this.productReadService.findAllProductComment(
      product_id,
    );
    // TODO: 판매자의 별점 구하기 -> 분리 안함
    return { product, comment };
  }

  // 상품 거래상태 수정하기
  async changeProductState(
    product_id: ProductIdParamDto['product_id'],
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

  // 상품 판매자 찾기
  async findProductSeller(product_id: ProductIdParamDto['product_id']) {
    return await this.productReadService.findSellerProduct(product_id);
  }

  // 찜 하기
  async createWish(
    product_id: ProductIdParamDto['product_id'],
    user: User['user_no'],
  ): Promise<Wish> {
    return await this.productCreateService.createWishData(product_id, user);
  }

  // 짐 삭제하기
  async deletedWish(
    product_id: ProductIdParamDto['product_id'],
    user: User['user_no'],
  ) {
    return await this.productDeleteService.deleteWishData(product_id, user);
  }

  // 상품 거래 상태 확인하기
  async checkProductState(
    product_id: ProductIdParamDto['product_id'],
  ): Promise<State> {
    return await this.productReadService.findProductStateData(product_id);
  }

  // 찜 목록 확인하기
  async checkProductWishList(
    product_id: ProductIdParamDto['product_id'],
    user_no: User['user_no'],
  ): Promise<Wish> {
    return await this.productReadService.findProductWishListData(
      product_id,
      user_no,
    );
  }

  // 댓글 업로드
  async createComment(
    data: CreateCommentDto,
    user: User['user_no'],
    product_id: ProductIdParamDto['product_id'],
  ): Promise<Comment> {
    return await this.productCreateService.createCommentData(
      data,
      user,
      product_id,
    );
  }

  // 댓글 작성자 확인하기
  async checkCommentWriter(comment_no: CommentIdParamDto['comment_id']) {
    return await this.productReadService.findCommentWriterData(comment_no);
  }

  // 댓글 삭제하기
  async deleteComment(comment_no: CommentIdParamDto['comment_id']) {
    return await this.productDeleteService.deleteCommentData(comment_no);
  }

  // 대댓글 업로드
  async createReComment(
    user_no: User['user_no'],
    data: CreateReCommentDto,
    comment_no: CommentIdParamDto['comment_id'],
  ): Promise<ReComment> {
    return await this.productCreateService.createReCommentData(
      user_no,
      data,
      comment_no,
    );
  }

  // 대댓글 작성자 확인
  async checkReComment(
    recomment_no: ReCommentIdParamDto['recomment_id'],
  ): Promise<ReComment> {
    return await this.productReadService.findReCommentData(recomment_no);
  }

  // 대댓글 삭제하기
  async deleteReComment(recomment_no: ReCommentIdParamDto['recomment_id']) {
    return await this.productDeleteService.deleteReCommentData(recomment_no);
  }
}
