import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '@root/database/entities/video.entity';
import { Repository } from 'typeorm';

import { VideoDetail } from '@root/database/entities/videoDetail.entity';
import { VideoListItemDto } from '../dto/responseVideo.dto';

export class VideoRepository {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(VideoDetail)
    private videoDetailRepository: Repository<VideoDetail>,
  ) {}

  async findOneByVideoId(videoId: string) {
    return await this.videoRepository.findOne({ where: { videoId } });
  }

  async createVideoDetail(platform: string, defaultLanguage: string) {
    const videoDetaiEntity = this.videoDetailRepository.create({
      platform,
      defaultLanguage,
    });

    return await this.videoDetailRepository.save(videoDetaiEntity);
  }

  async create(videoListItemDto: VideoListItemDto, videoDetailId: number) {
    const videoEntity = this.videoRepository.create({
      title: videoListItemDto.videoTitle,
      description: videoListItemDto.videoDescription,
      thumbnail: videoListItemDto.videoThumbnail,
      createdDate: videoListItemDto.videoPublishedAt,
      videoId: videoListItemDto.videoId,
      videoDetail: { id: videoDetailId },
    });
    return await this.videoRepository.save(videoEntity);
  }
}
