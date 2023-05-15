import { CreateUserKeywordDto } from './../dto/keywordUser/requestKeywordUser.dto';
import { KeywordUserRepository } from './../repositories/keywordUser.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeywordUserService {
  constructor(private readonly keywordUserRepository: KeywordUserRepository) {}

  async create(createUserKeywordDto: CreateUserKeywordDto) {
    return await this.keywordUserRepository.create(createUserKeywordDto);
  }
}
