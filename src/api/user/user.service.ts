import { FindUserByUserIdDto, CreateUserDto } from './dto/requestUser.dto';
import { UserRepositoyry } from './user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private userRepositoyry: UserRepositoyry) {}

  async findByUserId(findUserByUserIdDto: FindUserByUserIdDto) {
    return await this.userRepositoyry.findById(findUserByUserIdDto);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepositoyry.create(createUserDto);
  }

  async updateById(userId, updateUserObject) {
    await this.userRepositoyry.updateById(userId, updateUserObject);
  }
}
