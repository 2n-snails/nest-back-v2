import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';

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
}
