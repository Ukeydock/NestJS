import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoyry } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepositoyry],
  exports: [UserService],
})
export class UserModule {}
