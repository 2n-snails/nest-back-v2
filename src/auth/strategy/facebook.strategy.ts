import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FaceBookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user = await this.authService.validateUser(profile.id);
    if (!user) {
      const userFirstnick = `usernick${Math.floor(Math.random() * 1000000)}`;
      await this.userService.joinUser(profile.id, userFirstnick, 'facebook');
      const user = await this.userService.findUserById(profile.id);
      // Access Token
      const access_token = await this.authService.createAccessToken(user);
      // Refresh Token
      const refresh_token = await this.authService.createRefreshToken(user);
      return { access_token, refresh_token };
    }
    // Access Token
    const access_token = await this.authService.createAccessToken(user);
    // Refresh Token
    const refresh_token = await this.authService.createRefreshToken(user);
    return { access_token, refresh_token };
  }
}
