import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '@root/database/entities/video.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { VideoDetail } from '@root/database/entities/videoDetail.entity';
import { ResponseVideoListPageDto, VideoListItemDto } from '../dto/responseVideo.dto';
import { FindAllViewVidoDto } from '../dto/requestVideo.dto';



export class VideoRepository {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(VideoDetail)
    private videoDetailRepository: Repository<VideoDetail>,
    
  ) {}

  async findOneByVideoId(videoId: string): Promise<Video> {
    return await this.videoRepository.findOne({ where: { videoId } });
  }

  // 유튜브 외 영상 플랫폼이 추가되면 플랫폼별로 분기처리
  async findVideoDetailByPlatformAndDefaultLanguage(findVideoDetailDto: {
    platform: string;
    defaultLanguage: string;
  }): Promise<VideoDetail> {
    return await this.videoDetailRepository.findOne({
      where: {
        platform: findVideoDetailDto.platform,
        defaultLanguage: findVideoDetailDto.defaultLanguage,
      },
    });
  }



  async findByKeyword( keyword: string ): Promise<ResponseVideoListPageDto[]> {
    const query = this.videoRepository
      .createQueryBuilder(`V01`)
      .select([
        `V01.title AS videoTitle`,
        `V01.id AS videoDBId`,
        `V01.thumbnail AS videoThumbnail`,
        `V01.description AS videoDescription`,
        `V01.videoId AS videoId`,
      ])
      .innerJoin(`keywordVideo`, `VK01`, `VK01.videoId = V01.id`)
      .innerJoin(`keyword`, `K01`, `K01.id = VK01.keywordId`)
      .where(`K01.keyword = :keyword`, {keyword });

    return await query.getRawMany();
  }

  async findViewVideoByUserId(userId: number, findAllViewVidoDto: FindAllViewVidoDto): Promise<VideoListItemDto[]> {
    const query = this.videoRepository
      .createQueryBuilder(`V01`)
      .select([
        `V01.title AS videoTitle`,
        `V01.id AS videoDBId`,
        `V01.thumbnail AS videoThumbnail`,
        `V01.description AS videoDescription`,
        `V01.videoId AS videoId`,
      ])
      .innerJoin(`viewVideo`, `VV01`, `VV01.videoId = V01.id`)
      .innerJoin(`user`, `U01`, `U01.id = VV01.userId`)
      .where(`U01.id = :userId`, { userId });

    return await query.getRawMany();
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
      duration: `${videoListItemDto.videoDetailData.videoDuration.hours}H 
 ${videoListItemDto.videoDetailData.videoDuration.minutes}M
 ${videoListItemDto.videoDetailData.videoDuration.seconds}S`,
    });
    return await this.videoRepository.save(videoEntity);
  }

  async updateViewCount(videoDbId: number, viewCount : number) : Promise<void> {
    await this.videoRepository.update({id : videoDbId}, {viewCount : viewCount})
  }
}
