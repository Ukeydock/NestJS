import {
  CreateAuthDto,
  FindAuthByEmailDto,
} from './dto/requestAuth.dto';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { Auth } from '@root/database/entities/auth.entity';
import { CommonService } from '@root/api/common/services/common.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthSocialLoginService {
  constructor(
    private readonly authRepository: AuthRepository,
    private userService: UserService,
    private jwtService: JwtService,

    private commonService: CommonService,
  ) { }

  private createJwtToken(user: { userId : number }) {
    const payload = { userId: user.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }


  private async createNewAuthUser(createAuthDto: CreateAuthDto) {
    const newAuthData = await this.authRepository.create(createAuthDto);
    const newAuthId = newAuthData.raw.insertId;
   
    const authData = await this.authRepository.findOneById(newAuthId);
    console.log(authData);
    return this.createJwtToken({ userId: authData.user.id });
  }

  private async execLogin(authData: Auth) {
    return this.createJwtToken({ userId: authData.user.id });
  }

  public async execSocialLogin(userAuthData: {
    email: string;
    snsId: string;
    profileImage: string;
    platform: string;
  }): Promise<{ appToken: string; existNickname: boolean }> {
    const authData = await this.authRepository.findOneByEmail({
      email: userAuthData.email,
    });
    if (authData) {
      const userData = await this.userService.findOneByUserId({
        userId: authData.user.id,
      });
      const appToken = await this.execLogin(authData);

      return {
        appToken,
        existNickname: userData.userNickname ? true : false,
      };
    }

    if (!authData) {
      const newUserData = await this.userService.create({
        nickname: this.commonService.createRandomNickname(),
      });
      console.log(newUserData);
      const newUserId = newUserData.raw.insertId;
      await this.userService.updateById(newUserId, {
        profileImage: userAuthData.profileImage,
      });

      const appToken = await this.createNewAuthUser({
        email: userAuthData.email,
        snsId: userAuthData.snsId,
        platform: userAuthData.platform,
        userId: newUserId,
      });
      return {
        appToken,
        existNickname: false,
      };
    }
  }
}

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) { }

  async findOneById(authId: number): Promise<Auth> {
    return await this.authRepository.findOneById(authId);
  }

  async findByEmail(findAuthByEmailDto: FindAuthByEmailDto): Promise<Auth> {
    return await this.authRepository.findOneByEmail(findAuthByEmailDto);
  }

  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.create(createAuthDto);
  }

  async deleteByAuthId(authId : number): Promise<void> {
    await this.authRepository.deleteByAuthId(authId);
  }
}
