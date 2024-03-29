import { Module } from '@nestjs/common';
import { KeywordService } from './services/keyword.service';
import { KeywordController } from './controllers/keyword.controller';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';
import { KeywordRepository } from './repositories/keyword.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Keyword,
  KeywordUser,
  KeywordVideo,
} from '@root/database/entities/keyword.entity';
import { KeywordUserService } from './services/keywordUser.service';
import { KeywordVideoService } from './services/keywordVideo.service';
import { KeywordUserRepository } from './repositories/keywordUser.repository';
import { KeywordVideoRepository } from './repositories/keywordVideo.repository';
import { KeywordUserController } from './controllers/keywordUser.controller';
import {
  FindAllByUserIdQueryBuilder,
  FindAllKeywordQueryBuilder,
  FindAllRecomendedKeywordQueryBuilder,
  SetQuery,
} from './repositories/queryBuilder/findAll.queryBuilder';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Keyword, KeywordUser, KeywordVideo]),
    UserModule,
  ],
  controllers: [KeywordController, KeywordUserController],
  providers: [
    KeywordService,
    KeywordUserService,
    KeywordVideoService,

    KeywordRepository,
    KeywordUserRepository,
    KeywordVideoRepository,

    SetQuery,
    FindAllKeywordQueryBuilder,
    FindAllByUserIdQueryBuilder,
    FindAllRecomendedKeywordQueryBuilder,
  ],
  exports: [KeywordService, KeywordVideoService],
})
export class KeywordModule { }
