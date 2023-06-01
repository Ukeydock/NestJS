import {
  FindKeywordByUserIdDto,
  FindRecommentKeywordDto,
} from '../dto/keyword.dto';
import { Injectable } from '@nestjs/common';
import { KeywordRepository } from '../repositories/keyword.repository';
import { CreateKeywordDto, FindAllKeywordDto } from '../dto/requestKeword.dto';
import {
  FindAllByUserIdQueryBuilder,
  FindAllKeywordQueryBuilder,
  FindAllRecomendedKeywordQueryBuilder,
} from '../repositories/queryBuilder/findAll.queryBuilder';

@Injectable()
export class KeywordService {
  constructor(
    private readonly keywordRepository: KeywordRepository,

    private readonly findAllKeywordQueryBuilder: FindAllKeywordQueryBuilder,
    private readonly findAllByUserIdQueryBuilder: FindAllByUserIdQueryBuilder,
    private readonly findAllRecomendedKeywordQueryBuilder: FindAllRecomendedKeywordQueryBuilder,
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
  async findAllRecomendedKeyword(
    findRecommentKeywordDto: FindRecommentKeywordDto,
  ) {
    return await this.findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword(
      findRecommentKeywordDto,
    );
  }
}
