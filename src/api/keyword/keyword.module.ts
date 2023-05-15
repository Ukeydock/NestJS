import { Module } from '@nestjs/common';
import { KeywordService } from './services/keyword.service';
import { KeywordController } from './keyword.controller';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';
import { KeywordRepository } from './repositories/keyword.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword, KeywordUser } from '@root/database/entities/keyword.entity';
import { KeywordUserService } from './services/keyword-user.service';
import { KeywordVideoService } from './services/keyword-video.service';
import { KeywordUserRepository } from './repositories/keywordUser.repository';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Keyword, KeywordUser])],
  controllers: [KeywordController],
  providers: [
    KeywordService,
    KeywordRepository,
    KeywordUserService,
    KeywordVideoService,

    KeywordUserRepository,
  ],
})
export class KeywordModule {}
