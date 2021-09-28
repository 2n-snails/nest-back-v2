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
export class JwtRefreshGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new HttpException(
        'Refresh Token 전송 안됨',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const refreshToken = authorization.replace('Bearer ', '');
    const tokenValidate = await this.validate(refreshToken);

    response.cookie('access_token', tokenValidate);
    return true;
  }

  async validate(token: string) {
    try {
      const token_verify = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserByUserNo(
        token_verify.user_no,
      );

      if (user.user_refresh_token === token) {
        return await this.authService.createAccessToken(user);
      } else {
        throw new Error('no permission');
      }
    } catch (error) {
      switch (error.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'no permission':
          throw new HttpException('해당 요청의 권한이 없습니다', 403);

        case 'jwt expired':
          throw new HttpException(
            '리프레쉬 토큰이 만료되었습니다. 로그인을 다시 진행해주세요',
            410,
          );

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
