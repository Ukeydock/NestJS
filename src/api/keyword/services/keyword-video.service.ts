import { Injectable } from '@nestjs/common';
import { KeywordVideoRepository } from '../repositories/keyword-video.repository';

@Injectable()
export class KeywordVideoService {
  constructor(
    private readonly keywordVideoRepository: KeywordVideoRepository,
  ) {}

  async create(videoId: number, keywordId: number) {
    return await this.keywordVideoRepository.create(videoId, keywordId);
  }
}
