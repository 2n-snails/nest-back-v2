import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { getRepository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(id: number | string): Promise<User | undefined> {
    return await this.userService.findUserById(id);
  }

  async createAccessToken(user: User) {
    const payload = {
      user_no: user.user_no,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '60m',
    });
  }

  async createRefreshToken(user: User) {
    const payload = {
      user_no: user.user_no,
    };
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    await this.userService.userRefreshTokenUpdate(refresh_token, user.user_no);

    return refresh_token;
  }
}
