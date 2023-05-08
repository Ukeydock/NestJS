import {
  FindUserByUserIdDto,
  CreateUserDto,
  FindUserListPageDto,
} from './dto/requestUser.dto';
import { UserRepositoyry } from './repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private userRepositoyry: UserRepositoyry) {}

  async findByUserId(findUserByUserIdDto: FindUserByUserIdDto) {
    return await this.userRepositoyry.findById(findUserByUserIdDto);
  }

  async findUserList(findUserListPageDto: FindUserListPageDto) {
    const userListData = await this.userRepositoyry.findUserList(
      findUserListPageDto,
    );
    return userListData;
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepositoyry.create(createUserDto);
  }

  async updateById(userId, updateUserObject) {
    await this.userRepositoyry.updateById(userId, updateUserObject);
  }
}
