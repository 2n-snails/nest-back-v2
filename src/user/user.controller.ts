import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  // 카카오 로그인 요청
  @Get('auth/kakao')
  kakaoLogin() {
    return;
  }
  // 카카오 로그인 콜백
  @Get('auth/kakao/callback')
  kakaocallback() {
    return;
  }

  // 페이스북 로그인 요청
  @Get('auth/facebook')
  facebookLogin() {
    return;
  }
  // 페이스북 로그인 콜백
  @Get('auth/facebook/callback')
  facebookcallback() {
    return;
  }

  // 리프레시 토큰 재발급
  @Get('auth/refresh-accesstoken')
  refreshAccessToken() {
    return { success: true, message: 'new accessToken Issuance success' };
  }

  // 내 상점 (판매물품, 판매완료, 구매내역, 찜한상품)
  // ?data={sell, sold, buy, wish}
  @Get('mypage/:user_id')
  myPage() {
    return;
  }

  // 내 정보
  @Get('my-info/:user_id')
  getMyInfo() {
    return;
  }

  // 프로필 사진 수정
  @Patch('my-info/:user_id/image')
  patchProfileImage() {
    return;
  }

  // 닉네임 수정
  @Patch('my-info/:user_id/nickname')
  patchNickName() {
    return;
  }

  // 유저에게 달린 후기
  @Get('review/:user_id')
  getReview() {
    return;
  }
  // 후기 작성
  @Post('review/:user_id')
  writeReview() {
    return;
  }
}
