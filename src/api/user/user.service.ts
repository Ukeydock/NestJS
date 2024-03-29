import {
  FindUserByUserIdDto,
  CreateUserDto,
  FindUserListPageDto,
} from './dto/requestUser.dto';
import { FindOneUserDto } from './dto/responseUser.dto';
import { UserRepositoyry } from './repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private userRepositoyry: UserRepositoyry) { }

  async findOneByUserId(userId: number): Promise<FindOneUserDto> {
    
    return await this.userRepositoyry.findOneById(userId);
  }

  async findUserSubscribedKeywordList(
    findUserListPageDto: FindUserListPageDto,
    keywordId: number,
  ) {
    const userListData =
      await this.userRepositoyry.findAllUserSubscribedKeywordList(
        findUserListPageDto,
        keywordId,
      );
    return userListData;
  }

  async findUserList(findUserListPageDto: FindUserListPageDto) {
    const userListData = await this.userRepositoyry.findAll(
      findUserListPageDto,
    );
    return userListData;
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepositoyry.create(createUserDto);
  }

  async updateById(userId : number, updateUserDto) {
    await this.userRepositoyry.updateById(userId, updateUserDto);
  }
}
