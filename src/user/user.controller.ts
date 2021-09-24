import { FacebookAuthGuard } from './../auth/guard/facebook.auth.guard';
import { MyPageStandardDTO } from './dto/myPageStandard.dto';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateUserNickDto } from './dto/updateUserNick.dto';
import { UpdateUserImageDto } from './dto/updateUserImage.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from './../auth/guard/jwt.access.guard';
import { User } from './../entity/user.entity';
import { UserIdParam } from './dto/userIdParam.dto';
import { UserService } from 'src/user/user.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 카카오 로그인 요청
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  kakaoLogin() {
    return;
  }
  // 카카오 로그인 콜백
  @Get('auth/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  kakaocallback(@Req() req, @Res() res: Response) {
    res.cookie('access_token', req.user);
    res.redirect(process.env.CLIENT_URL);
  }

  // 페이스북 로그인 요청
  @UseGuards(FacebookAuthGuard)
  @Get('auth/facebook')
  facebookLogin() {
    return;
  }
  // 페이스북 로그인 콜백
  @UseGuards(FacebookAuthGuard)
  @Get('auth/facebook/callback')
  facebookcallback(@Req() req, @Res() res: Response) {
    res.cookie('access_token', req.user);
    res.redirect(process.env.CLIENT_URL);
  }

  // 리프레시 토큰 재발급
  @Get('auth/refresh-accesstoken')
  refreshAccessToken() {
    return { success: true, message: 'new accessToken Issuance success' };
  }

  // 내 상점 (판매물품, 판매완료, 구매내역, 찜한상품)
  // ?standard={sale, sold, buy, wish}
  @Get('mypage/:user_id')
  myPage(
    @Param() param: UserIdParam,
    @Query() standardQuery: MyPageStandardDTO,
  ): any {
    const userId = param.user_id;
    const standard = standardQuery.standard;

    return this.userService.findMyPage(userId, standard);
  }

  // 내 정보
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @Get('my-info/:user_id')
  async getMyInfo(
    @Req() req,
    @Param() param: UserIdParam,
  ): Promise<User | undefined> {
    const paramUserId = Number(param.user_id);
    const tokenUserId = req.user.user_no;

    if (paramUserId === tokenUserId) {
      return await this.userService.findMyInfo(tokenUserId);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  // 프로필 사진 수정
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @Patch('my-info/:user_id/image')
  async patchProfileImage(
    @Req() req,
    @Body() updateUserImageDto: UpdateUserImageDto,
    @Param() param: UserIdParam,
  ) {
    const paramUserId = Number(param.user_id);
    const tokenUserId = req.user.user_no;
    const { image } = updateUserImageDto;

    if (paramUserId === tokenUserId) {
      return await this.userService.userProfileImageUpdate(tokenUserId, image);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  // 닉네임 수정
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @Patch('my-info/:user_id/nickname')
  async patchNickName(
    @Req() req,
    @Param() param: UserIdParam,
    @Body() updateUserNickDto: UpdateUserNickDto,
  ) {
    const paramUserId = Number(param.user_id);
    const tokenUserId = req.user.user_no;
    const { userNick } = updateUserNickDto;

    if (paramUserId === tokenUserId) {
      return await this.userService.userNickUpdate(tokenUserId, userNick);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  // 유저에게 달린 후기
  @Get('review/:user_id')
  async getReview(@Req() req, @Param() param: UserIdParam): Promise<any> {
    const paramUserId = Number(param.user_id);
    return await this.userService.findUserReview(paramUserId);
  }

  // 후기 작성
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @Post('review/:user_id')
  async writeReview(
    @Req() req,
    @Body() createReviewDto: CreateReviewDto,
    @Param() param: UserIdParam,
  ) {
    const writer = req.user.user_no;
    const receiver = Number(param.user_id);
    return await this.userService.reviewWrite(
      writer,
      receiver,
      createReviewDto,
    );
  }
}
