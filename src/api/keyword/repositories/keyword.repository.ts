import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword, KeywordUser } from '@root/database/entities/keyword.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '@root/database/entities/user.entity';

@Injectable()
export class KeywordRepository {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(User)
    private userRepositoyry: Repository<User>,
  ) { }

  // 해당 유저가 구독한 키워드 리스트를 가져온다.
  async findAllByUserId(userId: number | number[] ): Promise<{ keyword: string, keywordId: number }[]> {
    const query = this.userRepositoyry
      .createQueryBuilder('U01')
      .select([`K01.keyword AS keyword`, `K01.id AS keywordId`])
      .innerJoin(`KeywordUser`, `KU01`, `U01.id = KU01.userId`)
      .innerJoin(`keyword`, `K01`, `KU01.keywordId = K01.id`)

    if (Array.isArray(userId)) {
      query.where(`U01.id IN (:...userId)`, { userId });
    } else {
      query.where(`U01.id = :userId`, { userId });
    }
    return await query.getRawMany();
  }

  async findByKeyword( keyword: string ): Promise<Keyword> {
    return await this.keywordRepository.findOne({
      where: { keyword },
    });
  }

  async create(keyword: string): Promise<Keyword> {
    const keywordEntity = this.keywordRepository.create({keyword});
    return await this.keywordRepository.save(keywordEntity);
    
  }
}
