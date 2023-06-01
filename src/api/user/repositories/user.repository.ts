import {
  CreateUserDto,
  FindUserByUserIdDto,
  FindUserListPageDto,
} from '../dto/requestUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';
import { Repository } from 'typeorm';
import {
  FindUserListQuery,
  FindUserSubscribedKeywordListQuery,
} from './userListQueryBuilder';

export class UserRepositoyry {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 유저 아이디로 유저 정보 조회
  async findOneById(findUserByUserIdDto: FindUserByUserIdDto) {
    return await this.userRepository.findOneBy({
      id: findUserByUserIdDto.userId,
    });
  }

  // 해당 키워드를 구독한 유저의 목록
  async findAllUserSubscribedKeywordList(
    findUserListPageDto: FindUserListPageDto,
    keywordId: number,
  ) {
    const findUserSubscribedKeywordListQuery =
      new FindUserSubscribedKeywordListQuery(
        findUserListPageDto,
        this.userRepository,
        keywordId,
      );

    return await findUserSubscribedKeywordListQuery.getQuery.getRawMany();
  }

  // 유저의 목록
  async findAll(findUserListPageDto: FindUserListPageDto) {
    const findUserQuery = new FindUserListQuery(
      findUserListPageDto,
      this.userRepository,
    );

    return await findUserQuery.getQuery.getRawMany();
  }

  // 유저 생성
  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.insert({ ...createUserDto });
  }

  // 유저 정보 수정
  async updateById(userId, updateUserObject) {
    await this.userRepository.update({ id: userId }, { ...updateUserObject });
  }
}
