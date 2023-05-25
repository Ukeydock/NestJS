import { FindKeywordByUserIdDto } from '../dto/keyword.dto';
import { Injectable } from '@nestjs/common';
import {
  FindAllKeywordQueryBuilder,
  KeywordRepository,
} from '../repositories/keyword.repository';
import { CreateKeywordDto, FindAllKeywordDto } from '../dto/requestKeword.dto';

@Injectable()
export class KeywordService {
  constructor(
    private readonly keywordRepository: KeywordRepository,
    private readonly findAllKeywordQueryBuilder: FindAllKeywordQueryBuilder,
  ) {}

  async findAll(findAllKeywordDto: FindAllKeywordDto) {
    return await this.findAllKeywordQueryBuilder.findAll(findAllKeywordDto);
  }

  async findAllByUserId(findKeywordByUserIdDto: FindKeywordByUserIdDto) {
    return await this.keywordRepository.findAllByUserId(findKeywordByUserIdDto);
  }

  async findByKeyword(findKeywordByKeywordDto: { keyword: string }) {
    return await this.keywordRepository.findByKeyword(findKeywordByKeywordDto);
  }

  async create(createKeywordDto: CreateKeywordDto) {
    return await this.keywordRepository.create(createKeywordDto);
  }
}
