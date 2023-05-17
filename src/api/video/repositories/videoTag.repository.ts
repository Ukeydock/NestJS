import { InjectRepository } from '@nestjs/typeorm';
import {
  VideoTag,
  VideoTagVideo,
} from '@root/database/entities/videoTag.entity';
import { Repository } from 'typeorm';

export class VideoTagRepository {
  constructor(
    @InjectRepository(VideoTag)
    private videoTagRepositoy: Repository<VideoTag>,
    @InjectRepository(VideoTagVideo)
    private videoTagVideoRepository: Repository<VideoTagVideo>,
  ) {}

  async findByTag(tag: string) {
    return await this.videoTagRepositoy.findOne({ where: { tag: tag } });
  }

  async create(tag: string) {
    const videoTagEntity = this.videoTagRepositoy.create({ tag });
    return await this.videoTagRepositoy.save(videoTagEntity);
  }

  async createVideoTagVideo(videoId: number, videoTagId: number) {
    const videoTagVideoEntity = this.videoTagVideoRepository.create({
      video: { id: videoId },
      videoTag: { id: videoTagId },
    });

    return await this.videoTagVideoRepository.save(videoTagVideoEntity);
  }
}
