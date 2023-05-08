import {
  CreateUserDto,
  FindUserByUserIdDto,
  FindUserListPageDto,
} from '../dto/requestUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';
import { Repository } from 'typeorm';
import { FindUserListQuery } from './userListQueryBuilder';

export class UserRepositoyry {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(findUserByUserIdDto: FindUserByUserIdDto) {
    return await this.userRepository.findOneBy({
      id: findUserByUserIdDto.userId,
    });
  }

  async findUserList(findUserListPageDto: FindUserListPageDto) {
    const findUserQuery = new FindUserListQuery(
      findUserListPageDto,
      this.userRepository,
    );

    return await findUserQuery.getQuery.getRawMany();
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.insert({ ...createUserDto });
  }

  async updateById(userId, updateUserObject) {
    await this.userRepository.update({ id: userId }, { ...updateUserObject });
  }
}
