import {
  FindAuthByAuthIdDto,
  CreateAuthDto,
  FindAuthByEmailDto,
} from './dto/requestAuth.dto';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { Auth } from '@root/database/entities/auth.entity';
import { CommonService } from '@root/common/services/common.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthSocialLoginService {
  constructor(
    private readonly authRepository: AuthRepository,
    private userService: UserService,
    private jwtService: JwtService,

    private commonService: CommonService,
  ) {}

  private createJwtToken(authId: { authId }) {
    const payload = { id: authId };
    return {
      appToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }

  private async createNewAuthUser(createAuthDto: CreateAuthDto) {
    const newAuthData = await this.authRepository.create(createAuthDto);

    return this.createJwtToken({ authId: newAuthData.raw.insertId });
  }

  private async execLogin(authData: Auth) {
    return this.createJwtToken({ authId: authData.id });
  }

  async execSocialLogin(userAuthData: {
    email: string;
    snsId: string;
    profileImage: string;
    platform: string;
  }) {
    const authData = await this.authRepository.findOneByEmail(userAuthData);

    if (authData) {
      return await this.execLogin(authData);
    }

    if (!authData) {
      const newUserData = await this.userService.create({
        nickname: this.commonService.createRandomNickname(),
      });
      const newUserId = newUserData.raw.insertId;
      console.log(newUserData.raw);
      await this.userService.updateById(newUserId, {
        profileImage: userAuthData.profileImage,
      });

      return await this.createNewAuthUser({
        email: userAuthData.email,
        snsId: userAuthData.snsId,
        platform: userAuthData.platform,
        userId: newUserId,
      });
    }
  }
}

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async findOneById(findAuthByAuthIdDto: FindAuthByAuthIdDto) {
    return await this.authRepository.findOneById(findAuthByAuthIdDto);
  }

  async findByEmail(findAuthByEmailDto: FindAuthByEmailDto) {
    return await this.authRepository.findOneByEmail(findAuthByEmailDto);
  }

  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.create(createAuthDto);
  }
}
