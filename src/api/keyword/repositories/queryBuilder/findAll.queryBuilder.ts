import { Keyword, KeywordUser } from '@root/database/entities/keyword.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  FindAllKeywordDto,
  FindKeywordByUserIdDto,
} from '../../dto/requestKeword.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindRecommendKeywordDto } from '../../dto/keyword.dto';
import { Injectable } from '@nestjs/common';
import { UserRepositoyry } from '@root/api/user/repositories/user.repository';
import { KeywordRepository } from '../keyword.repository';
import { GetRecommendKeywordIds } from './findRecommend.queryBuilder';
import { ResponseKeywordDto } from '../../dto/responseKeword.dto';

@Injectable()
export class SetQuery {
  protected query: SelectQueryBuilder<Keyword>;

  @InjectRepository(Keyword)
  protected keywordRepository?: Repository<Keyword>;
  @InjectRepository(KeywordUser)
  protected keywordUserRepository?: Repository<KeywordUser>;

  // 키워드가 유저에게 존재하는지 확인
  protected setIsExistKeyword(userId: number) {
    this.query.leftJoin(`KeywordUser`, `KU01`, `K01.id = KU01.keywordId AND KU01.userId = ${userId}`);

    this.query.addSelect(
      `CASE WHEN KU01.keywordId IS NULL THEN false ELSE true END AS isExistKeyword`,
    );
  }

  // 키워드 검색
  protected setSearchByKeyword(keyword: string) {
    this.query = this.query.where(`K01.keyword LIKE :keyword`, {
      keyword: `%${keyword}%`,
    });
  }

  // 유저 아이디로 키워드 검색
  protected setWhereByUserId(userId: number) {
    this.query = this.query
      .innerJoin(`KeywordUser`, `KU01`, `K01.id = KU01.keywordId`)
      .innerJoin(`user`, `U01`, `KU01.userId = U01.id`)
      .where(`U01.id = :userId`, { userId });
  }

  // limit 설정
  protected setLimit(page?: number, limit?: number) {
    page = page ?? 1;
    limit = limit ?? 10;

    const offset = (page - 1) * limit;
    this.query = this.query.limit(limit).offset(offset);
  }
}

export class FindAllKeywordQueryBuilder extends SetQuery {
  constructor() {
    super();
  }
  // 모든 키워드를 찾기
  public async findAll(userId : number ,findAllKeywordDto: FindAllKeywordDto): Promise<ResponseKeywordDto[]> {
    this.query = this.keywordRepository
      .createQueryBuilder(`K01`)
      .select([
        `K01.id AS keywordId`,
        `K01.keyword AS keyword`,
        `K01.createdAt AS createdAt`,
        `K01.count AS count`,
      ])
      .groupBy(`K01.id`);

    this.setSearchByKeyword(findAllKeywordDto.keyword);
    this.setLimit(findAllKeywordDto.page, findAllKeywordDto.limit);
    this.setIsExistKeyword(userId);

    return await this.query.getRawMany();
  }
}

export class FindAllByUserIdQueryBuilder extends SetQuery {
  constructor() {
    super();
  }

  // 해당 유저가 가진 키워드만 조회
  public async findAllByUserId(userId : number ,findKeywordByUserIdDto: FindKeywordByUserIdDto) {
    this.query = this.keywordRepository
      .createQueryBuilder(`K01`)
      .select([`K01.*`]);

    this.setWhereByUserId(userId);
    this.setLimit(findKeywordByUserIdDto.page, findKeywordByUserIdDto.limit);
    this.setIsExistKeyword(userId);

    return await this.query.getRawMany();
  }
}

@Injectable()
export class FindAllRecomendedKeywordQueryBuilder extends SetQuery {
  constructor(
    private userRepository: UserRepositoyry,
    private keywordRepositoryClass: KeywordRepository
  ) {
    super();
  }
  // 추천 키워드 찾기
  public async findAllRecomendedKeyword(
    userId : number,
    findRecommentKeywordDto: FindRecommendKeywordDto,
  ): Promise<ResponseKeywordDto[]> {
    this.query = this.keywordRepository
      .createQueryBuilder(`K01`)
      .select([
        `K01.id AS keywordId`,
        `K01.keyword AS keyword`,
        `K01.createdAt AS createdAt`,
        `K01.count AS count`,
      ])
      .groupBy(`K01.id`);

    switch (findRecommentKeywordDto.recomendType) {
      case 'recent':
        this.query.orderBy(`K01.id`, `DESC`);
        this.setLimit(1, findRecommentKeywordDto.limit);
        break;
      case 'popular':
        // 사람들이 많이 등록한 키워드
        this.query.orderBy(`K01.count`, `DESC`);
        this.setLimit(1, findRecommentKeywordDto.limit);
        break;
      case 'recommend':
        const userData = await this.userRepository.findOneById( userId )

        // 랜덤한 같은 성별,나이의 유저를 10명 가져와서
        const equelGenderAgeUser = await this.userRepository.findAllByGenderAndAge(
          { gender: userData.userGender, birthday: userData.userBirthday, limit: 10 }
        )

        // 가져온 유저들을 이용해 키워드를 가져온다.
        const userIds = equelGenderAgeUser.map((user) => user.userId)
        const keywordList = await this.keywordRepositoryClass.findAllByUserId(userIds )

        const getRecommendKeywordIds = new GetRecommendKeywordIds(keywordList)
        const keywordIds = getRecommendKeywordIds.build()
        this.query.orderBy(`K01.count`, `DESC`);
        this.setLimit(1, findRecommentKeywordDto.limit);
        this.query.where(`K01.id IN (:...keywordIds)`, { keywordIds });
          
        break;
    }
    return await this.query.getRawMany();
  }
}
