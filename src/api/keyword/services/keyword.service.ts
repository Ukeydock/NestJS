import {
  FindKeywordByUserIdDto,
  FindRecommendKeywordDto,
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
    private readonly findAllRecomendedKeywordQueryBuilder: FindAllRecomendedKeywordQueryBuilder,
  ) { }

  /**
   * 
   * @param userId 해당 유저의 키워드를 가져오기 위해
   * @param findAllKeywordDto 키워드 필터링
   * @returns 
   */
  async findAll(userId : number ,findAllKeywordDto: FindAllKeywordDto): Promise<ResponseKeywordDto[]> {
    return await this.findAllKeywordQueryBuilder.findAll(userId, findAllKeywordDto);
  }

  async findAllByUserId(userId: number): Promise<{
    keyword: string;
    keywordId : number
  }[]> {
    return await this.keywordRepository.findAllByUserId(userId);
  }

  async findOneByKeyword(keyword: string ): Promise<Keyword> {
    return await this.keywordRepository.findByKeyword(keyword);
  }

  async create(keyword: string) {
    return await this.keywordRepository.create(keyword);
  }

  // 추천 키워드 찾기. 쿼리스트링으로 기준 잡기
  async findAllRecomendedKeyword(
    userId : number,
    findRecommentKeywordDto: FindRecommendKeywordDto,
  ): Promise<ResponseKeywordDto[]> {
    return await this.findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword(
      userId,
      findRecommentKeywordDto,
    );
  }
}
