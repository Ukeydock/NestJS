import { FindKeywordByUserIdDto } from '../dto/keyword.dto';
import { Injectable } from '@nestjs/common';
import { KeywordRepository } from '../repositories/keyword.repository';
import { CreateKeywordDto } from '../dto/requestKeword.dto';

@Injectable()
export class KeywordService {
  constructor(private readonly keywordRepository: KeywordRepository) {}

  async findAllByUserId(findKeywordByUserIdDto: FindKeywordByUserIdDto) {
    return await this.keywordRepository.findAllByUserId(findKeywordByUserIdDto);
  }

  async create(createKeywordDto: CreateKeywordDto) {
    return await this.keywordRepository.create(createKeywordDto);
  }
}
