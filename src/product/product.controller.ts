import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guard/jwt.access.guard';
import { MainPageDto } from './dto/mainpage.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { SearchDto } from './dto/search.dto';
import { ProductIdParamDto } from './dto/product.param.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ChangeProductStateDto } from './dto/chageProductState.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentIdParamDto } from './dto/comment.param.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 메인페이지 데이터
  @Get()
  async mainPageData(@Query() query: MainPageDto) {
    const data = await this.productService.getMainPageData(query);
    return data;
  }

  // 상품 등록
  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async uploadProduct(@Req() req, @Body() data: CreateProductDto) {
    const user_no = req.user.user_no;
    const result = await this.productService.createProduct(user_no, data);
    return { success: result };
  }

  // 상품명 검색
  // ?prodcut-name={data}
  @Get('search')
  async searchProduct(@Query() query: SearchDto) {
    const data = await this.productService.searchProduct(query);
    return data;
  }

  // 상품 상세 페이지
  @Get(':product_id')
  async productDetail(@Param() param: ProductIdParamDto) {
    const data = await this.productService.findOneProduct(param.product_id);
    return data;
  }

  // 상품 수정
  @UseGuards(JwtAccessAuthGuard)
  @Put(':product_id')
  async modifyProduct(
    @Req() req,
    @Body() data: UpdateProductDto,
    @Param() param: ProductIdParamDto,
  ) {
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
  async deleteProduct(@Req() req, @Param() param: ProductIdParamDto) {
    // TODO: deleteProduct함수로 req.user전달 안하고 여기서 체크 후 익셉션 처리하기.
    const result = await this.productService.deleteProduct(
      req.user,
      param.product_id,
    );
    return result ? { success: true } : { success: false };
  }

  // 상품 상태 수정
  // state={ reservation, sold }, user_no
  @UseGuards(JwtAccessAuthGuard)
  @Patch(':product_id')
  async changeProductState(
    @Req() req,
    @Param() param: ProductIdParamDto,
    @Query() query: ChangeProductStateDto,
  ) {
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
  async wishProduct(@Req() req, @Param() param: ProductIdParamDto) {
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
    await this.productService.createWish(param.product_id, req.user.user_no);
    return { success: true, message: '상품 찜 추가 성공' };
  }

  // 상품 찜 취소
  @UseGuards(JwtAccessAuthGuard)
  @Delete(':product_id/wish')
  async deleteProductWish(@Req() req, @Param() param: ProductIdParamDto) {
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
  @UseGuards(JwtAccessAuthGuard)
  @Post(':product_id/comment')
  async writeProductComment(
    @Req() req,
    @Body() data: CreateCommentDto,
    @Param() param: ProductIdParamDto,
  ) {
    const product_check = await this.productService.checkProductState(
      param.product_id,
    );
    if (!product_check) {
      return {
        success: false,
        message: `${param.product_id}번 상품이 존재하지 않습니다.`,
      };
    }
    if (product_check.state === 'delete') {
      return {
        success: false,
        message: '삭제된 상품에는 댓글을 작성할 수 없습니다.',
      };
    }

    await this.productService.createComment(
      data,
      req.user.user_no,
      param.product_id,
    );
    return { success: true, message: '댓글 작성 성공' };
  }

  // 상품 댓글 삭제
  @UseGuards(JwtAccessAuthGuard)
  @Delete(':comment_id/comment')
  async deleteProductComment(@Req() req, @Param() param: CommentIdParamDto) {
    const comment_check = await this.productService.checkCommentWriter(
      param.comment_id,
    );
    if (!comment_check) {
      return {
        success: false,
        message: '이미 삭제된 댓글이거나 존재하지 않는 댓글입니다.',
      };
    }
    console.log(comment_check);
    if (comment_check.user.user_no !== req.user.user_no) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const result = await this.productService.deleteComment(param.comment_id);
    return result.affected
      ? { success: true, message: '댓글 삭제 성공' }
      : { success: false, message: '댓글 삭제 실패' };
  }

  // 상품 대댓글 작성
  @UseGuards(JwtAccessAuthGuard)
  @Post(':comment_id/recomment')
  async writeProductRecomment(@Req() req, @Body() data, @Param() param) {
    const comment_check = await this.productService.checkCommentWriter(
      param.comment_id,
    );
    if (!comment_check) {
      return {
        success: false,
        message: '삭제된 댓글 또는 잘못된 댓글 번호 입니다.',
      };
    }
    await this.productService.createReComment(
      req.user.user_no,
      data,
      param.comment_id,
    );
    return { success: true, message: '대댓글 작성 성공' };
  }

  // 상품 대댓글 삭제
  @UseGuards(JwtAccessAuthGuard)
  @Delete(':recomment_id/recomment')
  async deleteProductRecomment(@Req() req, @Param() param) {
    const recomment_check = await this.productService.checkReComment(
      param.recomment_id,
    );
    if (!recomment_check) {
      return {
        success: false,
        message: '삭제된 댓글 또는 잘못된 댓글 번호 입니다.',
      };
    }
    if (recomment_check.user.user_no !== req.user.user_no) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const result = await this.productService.deleteReComment(
      param.recomment_id,
    );
    return result.affected
      ? { success: true, message: '대댓글 삭제 성공' }
      : { success: false, message: '대댓글 삭제 실패' };
  }
}
