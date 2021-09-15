import { ProductService } from './product.service';
import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 메인페이지 데이터
  @Get('/')
  mainPageData() {
    return;
  }

  // 상품 등록
  @Post('/')
  uploadProduct() {
    return;
  }

  // 상품명 검색
  // ?prodcut-name={data}
  @Get('search')
  searchProduct() {
    return;
  }

  // 상품 상세 페이지
  @Get(':product_id')
  productDetail() {
    return;
  }

  // 상품 수정
  @Put(':product_id')
  modifyProduct() {
    return;
  }

  // 상품 삭제
  @Delete(':product_id')
  deleteProduct() {
    return;
  }

  // 상품 상태 수정
  @Patch(':product_id')
  changeProductState() {
    return;
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
