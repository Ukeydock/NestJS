import { CreateKeywordDto } from '@root/api/keyword/dto/requestKeword.dto';
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

  async findAllByUserId(findUserByUserIdDto: FindUserByUserIdDto) {
    const query = this.userRepositoyry
      .createQueryBuilder('U01')
      .select(``)
      .innerJoin(`keywordUser`, `KU01`)
      .innerJoin(`keyword`, `K01`);

    return await query.getRawMany();
  }

  async create(createKeywordDto: CreateKeywordDto) {
    const keyword = this.keywordRepository.create(createKeywordDto);
    return await this.keywordRepository.save(keyword);
  }
}
