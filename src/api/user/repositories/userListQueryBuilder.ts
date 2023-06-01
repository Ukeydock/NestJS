import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { FindUserListPageDto } from '../dto/requestUser.dto';
import { User } from '@root/database/entities/user.entity';

class UserListQueryBuilder {
  protected query: SelectQueryBuilder<User>;

  constructor(
    private findUserListPageDto: FindUserListPageDto,
    private userRepository: Repository<User>,
  ) {
    const offset = (this.getPage - 1) * this.getLimit;
    this.query = this.userRepository
      .createQueryBuilder(`U01`)
      .select([
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
      .where(`U01.deletedAt IS NULL`)
      .limit(this.getLimit)
      .groupBy(`U01.id`)
      .offset(offset);
  }
  get getQuery() {
    return this.query;
  }

  get getGender() {
    return this.findUserListPageDto.gender;
  }
  get getJob() {
    return this.findUserListPageDto.job;
  }
  get getAge() {
    return this.findUserListPageDto.age;
  }
  get getPage() {
    return this.findUserListPageDto.page;
  }
  get getLimit() {
    return this.findUserListPageDto.limit;
  }
}

export class FindUserListQuery extends UserListQueryBuilder {
  constructor(
    findUserListPageDto: FindUserListPageDto,
    userRepository: Repository<User>,
  ) {
    super(findUserListPageDto, userRepository);
  }
}

export class FindUserSubscribedKeywordListQuery extends UserListQueryBuilder {
  constructor(
    findUserListPageDto: FindUserListPageDto,
    userRepository: Repository<User>,
    keywordId: number,
  ) {
    super(findUserListPageDto, userRepository);
    this.setJoinKeyword(keywordId);
  }

  setJoinKeyword(keywordId: number) {
    this.query
      .innerJoin(`keywordUser`, `KU01`, `U01.id = KU01.userId`)
      .andWhere(`KU01.keywordId = :keywordId`, { keywordId });
  }
}
