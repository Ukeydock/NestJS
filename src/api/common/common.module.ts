import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { UserRepositoyry } from '../user/repositories/user.repository';
import { CommonResponseDto } from './dto/response.dto';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonResponseDto],
  controllers: [],
  providers: [JwtStrategy, UserRepositoyry],
  exports: [
    CommonResponseDto,
    JwtStrategy,
    UserRepositoyry,
    TypeOrmModule.forFeature([User]),
  ],
})
export class CommonModule {}
