import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepositoyry } from '@root/api/user/repositories/user.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepositoyry) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: { userId: number }) {
    const userData = await this.userRepository.findOneById(payload.userId);
    return {
      userId: userData.userId,
      nickname: userData.userNickname,
      age: userData.userAge,
      gender: userData.userGender,
      profileImage: userData.userProfileImage,
    };
  }
}
