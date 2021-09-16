import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

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
    request.user = tokenValidate;
    response.cookie('access_token', tokenValidate);
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
        const user = await this.userService.findUserById(
          token_verify.user_provider_id,
        );
        // TODO: find Refresh Token and new Access Token Generate
        const new_access_token = await this.authService.createAccessToken(user);
        return new_access_token;
      }
      const user = await this.userService.findUserById(
        token_verify.user_provider_id,
      );
      return user;
    } catch (error) {
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
