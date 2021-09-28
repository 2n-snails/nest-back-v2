import { FacebookAuthGuard } from './../auth/guard/facebook.auth.guard';
import { MyPageStandardDTO } from './dto/myPageStandard.dto';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateUserNickDto } from './dto/updateUserNick.dto';
import { UpdateUserImageDto } from './dto/updateUserImage.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { JwtRefreshGuard } from 'src/auth/guard/jwt.refresh.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: `카카오 로그인`,
    description: `카카오 로그인 요청 라우터`,
  })
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  kakaoLogin() {
    return;
  }

  @ApiOperation({
    summary: `카카오 로그인 콜백`,
    description: `카카오 로그인 요청시 콜백 라우터`,
  })
  @Get('auth/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  kakaocallback(@Req() req, @Res() res: Response) {
    const { access_token, refresh_token } = req.user;
    res.cookie('access_token', access_token);
    res.cookie('refresh_token', refresh_token);
    res.redirect(process.env.CLIENT_URL);
  }

  @ApiOperation({
    summary: `페이스북 로그인`,
    description: `페이스북 로그인 요청 라우터`,
  })
  @UseGuards(FacebookAuthGuard)
  @Get('auth/facebook')
  facebookLogin() {
    return;
  }

  @ApiOperation({
    summary: `페이스북 로그인 콜백`,
    description: `페이스북 로그인 요청시 콜백 라우터`,
  })
  @UseGuards(FacebookAuthGuard)
  @Get('auth/facebook/callback')
  facebookcallback(@Req() req, @Res() res: Response) {
    const { access_token, refresh_token } = req.user;
    res.cookie('access_token', access_token);
    res.cookie('refresh_token', refresh_token);
    res.redirect(process.env.CLIENT_URL);
  }

  // 리프레시 토큰 재발급
  @UseGuards(JwtRefreshGuard)
  @Get('auth/refresh-accesstoken')
  refreshAccessToken() {
    return { success: true, message: '엑세스 토큰 재발급 성공' };
  }

  // ?standard={sale, sold, buy, wish}
  @ApiOperation({
    summary: `유저의 상점`,
    description: `유저 상점의 판매물품, 판매완료, 구매내역, 찜한상품 요청 라우터`,
  })
  @Get('mypage/:user_id')
  myPage(
    @Param() param: UserIdParam,
    @Query() standardQuery: MyPageStandardDTO,
  ): any {
    const userId = param.user_id;
    const standard = standardQuery.standard;
    return this.userService.findMyPage(userId, standard);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: `내 정보`,
    description: `내 정보 요청 라우터`,
  })
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: `프로필 사진 수정`,
    description: `프로필 사진 수정시 요청 라우터`,
  })
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: `닉네임 수정`,
    description: `닉네임 수정시 요청 라우터`,
  })
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

  @ApiOperation({
    summary: `유저의 후기`,
    description: `유저에게 달린 후기 요청 라우터`,
  })
  @Get('review/:user_id')
  async getReview(@Req() req, @Param() param: UserIdParam): Promise<any> {
    const paramUserId = Number(param.user_id);
    return await this.userService.findUserReview(paramUserId);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: `후기 작성`,
    description: `어떤 상품에 대해 다른 유저에게 후기 작성 라우터`,
  })
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: `로그아웃`,
    description: `유저 로그아웃`,
  })
  @UseGuards(JwtAccessAuthGuard)
  @Get('logout')
  async logout(@Req() req: any) {
    const userId = req.user.user_no;
    const result = await this.userService.logoutUser(userId);
    if (result.affected) {
      return { success: true, message: '로그아웃 성공' };
    }
    throw new HttpException('server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: `회원 탈퇴`,
    description: `유저 회원 탈퇴 요청 라우터`,
  })
  @UseGuards(JwtAccessAuthGuard)
  @Get('resign')
  async resign(@Req() req: any) {
    const userId = req.user.user_no;
    const result = await this.userService.deleteUser(userId);
    if (result.affected) {
      return { success: true, message: '유저 삭제 성공' };
    }
    throw new HttpException('server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
