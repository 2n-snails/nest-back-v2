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
    const result = await this.productService.deleteProduct(
      req.user,
      param.product_id,
    );
    return result ? { success: true } : { success: false };
  }

  // 상품 상태 수정
  // state={ reservation, sold_out }, user_no
  @Patch(':product_id')
  async changeProductState(@Param() param, @Query() query) {
    return await this.productService.changeProductState(
      param.product_id,
      query,
    );
  }

  // 상품 찜하기
  @Post(':product_id/wish')
  wishProduct() {
    return;
  }

  // 상품 찜 취소
  @Delete(':product_id/wish')
  deleteProductWish() {
    return;
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
