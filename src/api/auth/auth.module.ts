import { Module } from '@nestjs/common';
import { AuthService, AuthSocialLoginService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '@root/database/entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
// import { GoogleStrategy } from './google/google.strategy';

import { UserModule } from '../user/user.module';
import { AppModule } from '@root/app.module';
import { CommonService } from '@root/api/common/services/common.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSocialLoginService,
    CommonService,

    AuthRepository,
    // GoogleStrategy,
  ],
})
export class AuthModule {}
