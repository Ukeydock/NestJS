// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService, AuthSocialLoginService } from '../auth.service';
import { UserService } from '@root/api/user/user.service';
import { CommonService } from '@root/api/common/services/common.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private authSocialLoginService: AuthSocialLoginService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
      callbackURL: process.env.BACK_SERVER_URI + '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, photos, id } = profile;
    const email = emails[0].value;
    const profileImage = photos[0].value;

    const appToken = await this.authSocialLoginService.execSocialLogin({
      email,
      snsId: id,
      profileImage,
      platform: 'google',
    });

    done(null, appToken);
  }
}
