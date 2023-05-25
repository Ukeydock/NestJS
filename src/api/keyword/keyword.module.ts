import { Module } from '@nestjs/common';
import { KeywordService } from './services/keyword.service';
import { KeywordController } from './controllers/keyword.controller';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';
import {
  FindAllKeywordQueryBuilder,
  KeywordRepository,
} from './repositories/keyword.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Keyword,
  KeywordUser,
  KeywordVideo,
} from '@root/database/entities/keyword.entity';
import { KeywordUserService } from './services/keywordUser.service';
import { KeywordVideoService } from './services/keyword-video.service';
import { KeywordUserRepository } from './repositories/keywordUser.repository';
import { KeywordVideoRepository } from './repositories/keyword-video.repository';
import { KeywordUserController } from './controllers/keyword-user.controller';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Keyword, KeywordUser, KeywordVideo]),
  ],
  controllers: [KeywordController, KeywordUserController],
  providers: [
    KeywordService,
    KeywordUserService,
    KeywordVideoService,

    KeywordRepository,
    KeywordUserRepository,
    KeywordVideoRepository,
    FindAllKeywordQueryBuilder,
  ],
  exports: [KeywordService, KeywordVideoService],
})
export class KeywordModule {}
