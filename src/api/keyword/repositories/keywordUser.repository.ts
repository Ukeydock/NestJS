import { CreateKeywordDto } from '@root/api/keyword/dto/requestKeword.dto';
import { FindUserByUserIdDto } from '@root/api/user/dto/requestUser.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword, KeywordUser } from '@root/database/entities/keyword.entity';
import { Repository } from 'typeorm';
import { User } from '@root/database/entities/user.entity';
import { CreateUserKeywordDto } from '../dto/keywordUser/requestKeywordUser.dto';

@Injectable()
export class KeywordUserRepository {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(User)
    private userRepositoyry: Repository<User>,
    @InjectRepository(KeywordUser)
    private keywordUserRepositoyry: Repository<KeywordUser>,
  ) {}

  async create(createUserKeywordDto: CreateUserKeywordDto) {
    const keyword = this.keywordUserRepositoyry.create({
      user: { id: createUserKeywordDto.userId },
      keyword: { id: createUserKeywordDto.keywordId },
    });
    await this.keywordUserRepositoyry.save(keyword);
  }
}
