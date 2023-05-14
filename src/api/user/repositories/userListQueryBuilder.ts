import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { FindUserListPageDto } from '../dto/requestUser.dto';
import { User } from '@root/database/entities/user.entity';

class UserListQueryBuilder {
  private query: SelectQueryBuilder<User>;

  constructor(
    private findUserListPageDto: FindUserListPageDto,
    private userRepository: Repository<User>,
  ) {
    const offset = (this.getPage - 1) * this.getLimit;
    this.query = this.userRepository
      .createQueryBuilder(`U01`)
      .select([`U01.*`])
      .limit(this.getLimit)
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
