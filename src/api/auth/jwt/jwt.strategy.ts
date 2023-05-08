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

  async validate(payload: { userId: { userId: number } }) {
    const userData = await this.userRepository.findById(payload.userId);
    return {
      userId: userData.id,
      nickname: userData.nickname,
      age: userData.age,
      gender: userData.gender,
    };
  }
}
