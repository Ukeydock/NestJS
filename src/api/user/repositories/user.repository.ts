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
import { FindOneUserDto } from '../dto/responseUser.dto';

export class UserRepositoyry {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // 유저 아이디로 유저 정보 조회
  async findOneById(findUserByUserIdDto: FindUserByUserIdDto): Promise<FindOneUserDto> {
    const findOneByIdQuery = this.userRepository.createQueryBuilder(`U01`).select([
      `U01.id AS userId`,
      `U01.nickname AS userNickname`,
      `U01.gender AS userGender`,
      `U01.job AS userJob`,
      `U01.createdAt AS userCreatedAt`,
      `U01.updatedAt AS userUpdatedAt`,
      `U01.profileImage AS userProfileImage`,
      ` CASE
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 10 THEN '어린이'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 20 THEN '10대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 30 THEN '20대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 40 THEN '30대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 50 THEN '40대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 60 THEN '50대'
            ELSE '60대 이상'
          END AS userAge`,

    ])
    return await findOneByIdQuery.getRawOne()
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
