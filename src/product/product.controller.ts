import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guard/jwt.access.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 메인페이지 데이터
  @Get()
  async mainPageData(@Query() query) {
    const data = await this.productService.getMainPageData(query);
    return data;
  }

  // 상품 등록
  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async uploadProduct(@Req() req, @Body() data) {
    const user_no = req.user.user_no;
    const result = await this.productService.createProduct(user_no, data);
    return { success: result };
  }

  // 상품명 검색
  // ?prodcut-name={data}
  @Get('search')
  async searchProduct(@Query() query) {
    const data = await this.productService.searchProduct(query);
    return data;
  }

  // 상품 상세 페이지
  @Get(':product_id')
  async productDetail(@Param() param) {
    const data = await this.productService.findOneProduct(param.product_id);
    return data;
  }

  // 상품 수정
  @UseGuards(JwtAccessAuthGuard)
  @Put(':product_id')
  async modifyProduct(@Req() req, @Body() data, @Param() param) {
    // TODO: modifyProduct함수로 req.user전달 안하고 여기서 체크 후 익셉션 처리하기.
    const result = await this.productService.modifyProduct(
      req.user,
      data,
      param.product_id,
    );
    return result ? { success: true } : { success: false };
  }

  // 상품 삭제
  @UseGuards(JwtAccessAuthGuard)
  @Delete(':product_id')
  async deleteProduct(@Req() req, @Param() param) {
    // TODO: deleteProduct함수로 req.user전달 안하고 여기서 체크 후 익셉션 처리하기.
    const result = await this.productService.deleteProduct(
      req.user,
      param.product_id,
    );
    return result ? { success: true } : { success: false };
  }

  // 상품 상태 수정
  // state={ reservation, sold_out }, user_no
  @UseGuards(JwtAccessAuthGuard)
  @Patch(':product_id')
  async changeProductState(@Req() req, @Param() param, @Query() query) {
    const seller = await this.productService.findProductSeller(
      param.product_id,
    );
    if (seller.user.user_no !== req.user.user_no) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.productService.changeProductState(
      param.product_id,
      query,
    );
  }

  // 상품 찜하기
  @UseGuards(JwtAccessAuthGuard)
  @Post(':product_id/wish')
  async wishProduct(@Req() req, @Param() param) {
    const product_check = await this.productService.checkProductState(
      param.product_id,
    );
    if (!product_check) {
      return {
        success: false,
        message: `${param.product_id}번 상품이 존재하지 않습니다.`,
      };
    }
    if (
      product_check.state !== 'sale' &&
      product_check.state !== 'reservation'
    ) {
      return {
        success: false,
        message: '삭제, 판매 완료된 상품은 찜목록에 추가할 수 없습니다.',
      };
    }

    const wish_check = await this.productService.checkProductWishList(
      param.product_id,
      req.user.user_no,
    );
    if (wish_check) {
      return { success: false, message: '이미 찜한 상품입니다.' };
    }
    // TODO: createWish 인가 wishProduct 인가? => wishProduct 가 최종인듯?
    await this.productService.wishProduct(param.product_id, req.user.user_no);
    // await this.productService.createWish(param.product_id, req.user.user_no);
    return { success: true, message: '상품 찜 추가 성공' };
  }

  // 상품 찜 취소
  @UseGuards(JwtAccessAuthGuard)
  @Delete(':product_id/wish')
  async deleteProductWish(@Req() req, @Param() param) {
    const wish_check = await this.productService.checkProductWishList(
      param.product_id,
      req.user.user_no,
    );
    if (!wish_check) {
      return { success: false, message: '찜 목록에 없는 상품입니다.' };
    }
    const result = await this.productService.deletedWish(
      param.product_id,
      req.user.user_no,
    );
    return result.affected
      ? { success: true, message: '찜 취소하기 성공' }
      : { success: false, message: '찜 취소 실패' };
  }

  // 상품 댓글 작성
  @Post(':product_id/comment')
  writeProductComment() {
    return;
  }

  // 상품 댓글 삭제
  @Delete(':product_id/comment')
  deleteProductComment() {
    return;
  }

  // 상품 대댓글 작성
  @Post(':product_id/recomment')
  writeProductRecomment() {
    return;
  }

  // 상품 대댓글 삭제
  @Delete(':product_id/recomment')
  deleteProductRecomment() {
    return;
  }
}
