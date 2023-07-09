import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { FindUserListPageDto } from '../dto/requestUser.dto';
import { User } from '@root/database/entities/user.entity';

class UserListQueryBuilder {
  protected query: SelectQueryBuilder<User>;

  
  constructor(
    private findUserListPageDto: FindUserListPageDto,
    private userRepository: Repository<User>,
  ) {
    
    this.query = this.userRepository
      .createQueryBuilder(`U01`)
      .select([
        `U01.id AS userId`,
      `U01.nickname AS userNickname`,
      `U01.gender AS userGender`,
      `U01.job AS userJob`,
      `U01.createdAt AS userCreatedAt`,
      `U01.updatedAt AS userUpdatedAt`,
      `CASE 
          WHEN LEFT(U01.profileImage, 4) = "http" 
          THEN U01.profileImage 
          ELSE CONCAT('${process.env.AWS_CLOUDFRONT_S3_PATH}', U01.profileImage) 
        END AS userProfileImage 
      `,
      `U01.birthday AS userBirthday`,
      ` CASE
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 10 THEN '어린이'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 20 THEN '10대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 30 THEN '20대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 40 THEN '30대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 50 THEN '40대'
            WHEN TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 60 THEN '50대'
            ELSE '60대 이상'
          END AS userAge`,
      // `K01.keyword AS userMainKeyword`,
      ])
      .where(`U01.deletedAt IS NULL`)
      .groupBy(`U01.id, K01.keyword`)
      
      this.setMainKeyword()
  }
  setOffset(){
    const offset = (this.getPage - 1) * this.getLimit;
    this.query.offset(offset).limit(this.getLimit);
  }

  setMainKeyword(){
    this.query.leftJoin(`keywordUser`, `KU01`, `KU01.userId = U01.id AND KU01.isMain = 1`)
    .leftJoin(`keyword`, `K01`, `K01.id = KU01.keywordId`)
    .addSelect(`K01.keyword AS userMainKeyword`)
  }

  public async getRawOne(){
    return await this.query.getRawOne();
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

export class FindOneUser extends UserListQueryBuilder {
  constructor(
    userRepository: Repository<User>,
    userId: number,
    findUserListPageDto?: FindUserListPageDto,
  ) {
    super(findUserListPageDto, userRepository);
    this.setWhereUserId(userId);
    
  }

  setWhereUserId(userId: number) {
    this.query.andWhere(`U01.id = :userId`, { userId });
  }
  
}

export class FindUserListQuery extends UserListQueryBuilder {
  constructor(
    findUserListPageDto: FindUserListPageDto,
    userRepository: Repository<User>,
  ) {
    super(findUserListPageDto, userRepository);
    this.setOffset();
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
        this.setOffset();

  }

  setJoinKeyword(keywordId: number) {
    this.query
      .innerJoin(`keywordUser`, `KU02`, `U01.id = KU02.userId`)
      .andWhere(`KU02.keywordId = :keywordId`, { keywordId });
  }
}
