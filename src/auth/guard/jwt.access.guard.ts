import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.replace('Bearer ', '');
    const tokenValidate = await this.validate(token);

    if (tokenValidate.change) {
      // 새로운 토큰 쿠키에 전송
      response.cookie('access_token', tokenValidate.new_token);
    } else {
      // 기존 토큰 그대로 쿠키에 전송
      response.cookie('access_token', token);
    }
    request.user = tokenValidate.user;
    return true;
  }

  async validate(token: string) {
    try {
      const token_verify = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const tokenExp = new Date(token_verify['exp'] * 1000);
      const current_time = new Date();

      const time_remaining = Math.floor(
        (tokenExp.getTime() - current_time.getTime()) / 1000 / 60,
      );

      if (time_remaining < 5) {
        const user = await this.userService.findUserByUserNo(
          token_verify.user_no,
        );
        // 엑세스 토큰 만료시간이 5분 미만 일때 리프레쉬 토큰 검증 후 새로운 토큰 발급
        const refresh_token_verify = await this.jwtService.verify(
          user.user_refresh_token,
          {
            secret: process.env.JWT_SECRET,
          },
        );
        // 리프레쉬 토큰 정보로 유저 조회
        const ex_user = await this.userService.findUserByUserNo(
          refresh_token_verify.user_no,
        );

        const new_token = await this.authService.createAccessToken(ex_user);
        return { user, new_token, change: true };
      }
      const user = await this.userService.findUserByUserNo(
        token_verify.user_no,
      );
      return { user, change: false };
    } catch (error) {
      console.log(error);

      switch (error.message) {
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'jwt expired':
          throw new HttpException('만료된 토큰입니다.', 410);

        default:
          throw new HttpException('서버 오류.', 500);
      }
    }
  }
}
