import {
  CreateKeywordDto,
  findAllKeywordDto,
} from '@root/api/keyword/dto/requestKeword.dto';
import { FindUserByUserIdDto } from '@root/api/user/dto/requestUser.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from '@root/database/entities/keyword.entity';
import { Repository } from 'typeorm';
import { User } from '@root/database/entities/user.entity';

@Injectable()
export class KeywordRepository {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(User)
    private userRepositoyry: Repository<User>,
  ) {}

  async findAll(findAllKeywordDto: findAllKeywordDto) {
    const query = this.keywordRepository
      .createQueryBuilder(`K01`)
      .select(`K01.*`);

    if (findAllKeywordDto.keyword) {
      query.orWhere(`K01.keyword LIKE :keyword`, {
        keyword: `%${findAllKeywordDto.keyword}%`,
      });
    }
    return await query.getRawMany();
  }

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
