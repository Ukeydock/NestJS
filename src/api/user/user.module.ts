import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoyry } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepositoyry, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
