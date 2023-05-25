import {
  CreateKeywordDto,
  FindAllKeywordDto,
} from '@root/api/keyword/dto/requestKeword.dto';
import { FindUserByUserIdDto } from '@root/api/user/dto/requestUser.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword, KeywordUser } from '@root/database/entities/keyword.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '@root/database/entities/user.entity';

export class FindAllKeywordQueryBuilder {
  private query: SelectQueryBuilder<Keyword>;
  private findAllKeywordDto: FindAllKeywordDto;

  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(KeywordUser)
    private keywordUserRepository: Repository<KeywordUser>,
  ) {}

  private setIsExistUser() {
    this.query.leftJoin(`KeywordUser`, `KU01`, `K01.id = KU01.keywordId`);

    this.query.addSelect(
      `CASE WHEN KU01.keywordId IS NULL THEN false ELSE true END AS isExistUser`,
    );
  }

  private setSearchByKeyword() {
    this.query = this.query.where(`K01.keyword LIKE :keyword`, {
      keyword: `%${this.findAllKeywordDto.keyword}%`,
    });
  }

  private setWhereByUserId() {
    this.query = this.query
      .innerJoin(`KeywordUser`, `KU01`, `K01.id = KU01.keywordId`)
      .innerJoin(`user`, `U01`, `KU01.userId = U01.id`)
      .where(`U01.id = :userId`, { userId: this.findAllKeywordDto.userId });
  }

  private setLimit() {
    const offset =
      (this.findAllKeywordDto.page - 1) * this.findAllKeywordDto.limit;
    this.query = this.query.limit(this.findAllKeywordDto.limit).offset(offset);
  }

  public async findAll(findAllKeywordDto: FindAllKeywordDto) {
    this.findAllKeywordDto = findAllKeywordDto;

    this.query = this.keywordRepository
      .createQueryBuilder(`K01`)
      .select([
        `K01.id AS keywordId`,
        `K01.keyword AS keyword`,
        `K01.createdAt AS createdAt`,
        `K01.count AS count`,
      ]);

    this.setSearchByKeyword();
    this.setLimit();
    this.setIsExistUser();

    return await this.query.getRawMany();
  }

  // 해당 유저가 가진 키워드만 조회
  public async findAllByUserId(findAllKeywordDto: FindAllKeywordDto) {
    this.findAllKeywordDto = findAllKeywordDto;
    this.query = this.keywordRepository
      .createQueryBuilder(`K01`)
      .select([`K01.*`]);

    this.setWhereByUserId();
    this.setLimit();
    this.setIsExistUser();

    return await this.query.getRawMany();
  }
}

@Injectable()
export class KeywordRepository {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(User)
    private userRepositoyry: Repository<User>,
  ) {}

  async findAllByUserId(findKeywordByUserIdDto: { userId: number }) {
    const query = this.userRepositoyry
      .createQueryBuilder('U01')
      .select([`K01.keyword AS keyword`, `K01.id AS keywordId`])
      .innerJoin(`KeywordUser`, `KU01`, `U01.id = KU01.userId`)
      .innerJoin(`keyword`, `K01`, `KU01.keywordId = K01.id`)
      .where(`U01.id = :userId`, { userId: findKeywordByUserIdDto.userId });
    return await query.getRawMany();
  }

  async findByKeyword(findKeywordByKeywordDto: { keyword: string }) {
    return await this.keywordRepository.findOne({
      where: { keyword: findKeywordByKeywordDto.keyword },
    });
  }

  async create(createKeywordDto: CreateKeywordDto) {
    const keyword = this.keywordRepository.create(createKeywordDto);
    return await this.keywordRepository.save(keyword);
  }
}
