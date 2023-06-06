import { CreateKeywordDto } from '@root/api/keyword/dto/requestKeword.dto';
import { FindUserByUserIdDto } from '@root/api/user/dto/requestUser.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Keyword,
  KeywordUser,
  KeywordVideo,
} from '@root/database/entities/keyword.entity';
import { Repository } from 'typeorm';
import { User } from '@root/database/entities/user.entity';
import { CreateUserKeywordDto } from '../dto/keywordUser/requestKeywordUser.dto';
import { Video } from '@root/database/entities/video.entity';

@Injectable()
export class KeywordVideoRepository {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    // @InjectRepository(Video)
    // private videoRepositoyry: Repository<Video>,
    @InjectRepository(KeywordVideo)
    private keywordVideoRepositoyry: Repository<KeywordVideo>,
  ) {}

  async create(videoId: number, keywordId: number) {
    const keywordVideoEntity = this.keywordVideoRepositoyry.create({
      video: { id: videoId },
      keyword: { id: keywordId },
    });
    return await this.keywordVideoRepositoyry.save(keywordVideoEntity);
  }
}
