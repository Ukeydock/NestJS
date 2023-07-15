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
import { ResponseKeywordDto } from '../dto/responseKeword.dto';
import { Keyword } from '@root/database/entities/keyword.entity';

@Injectable()
export class KeywordService {
  constructor(
    private readonly keywordRepository: KeywordRepository,

    private readonly findAllKeywordQueryBuilder: FindAllKeywordQueryBuilder,
    private readonly findAllByUserIdQueryBuilder: FindAllByUserIdQueryBuilder,
    private readonly findAllRecomendedKeywordQueryBuilder: FindAllRecomendedKeywordQueryBuilder,
  ) { }

  async findAll(userId : number ,findAllKeywordDto: FindAllKeywordDto): Promise<ResponseKeywordDto[]> {
    return await this.findAllKeywordQueryBuilder.findAll(userId, findAllKeywordDto);
  }

  async findAllByUserId(findKeywordByUserIdDto: FindKeywordByUserIdDto): Promise<{
    keyword: string;
    keywordId : number
  }[]> {
    return await this.keywordRepository.findAllByUserId(findKeywordByUserIdDto);
  }

  async findByKeyword(keyword: string ): Promise<Keyword> {
    return await this.keywordRepository.findByKeyword(keyword);
  }

  async create(createKeywordDto: CreateKeywordDto) {
    return await this.keywordRepository.create(createKeywordDto);
  }

  // 추천 키워드 찾기. 쿼리스트링으로 기준 잡기
  async findAllRecomendedKeyword(
    userId : number,
    findRecommentKeywordDto: FindRecommentKeywordDto,
  ): Promise<ResponseKeywordDto[]> {
    return await this.findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword(
      userId,
      findRecommentKeywordDto,
    );
  }
}
