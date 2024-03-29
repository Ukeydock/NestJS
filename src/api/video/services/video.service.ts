import { google } from 'googleapis';

import { BadRequestException, Injectable } from '@nestjs/common';
import { FindAllViewVidoDto, VideoPageDto } from '../dto/requestVideo.dto';
import { parseUrl } from 'url-lib';

import {
  VideoRepository,
} from '../repositories/video.repository';
import { ResponseVideoListPageDto, VideoDataDto, VideoListItemDto } from '../dto/responseVideo.dto';
import { VideoListQueryBuilder, VideoListQueryBuilderForView } from '../repositories/queryBuilder/videoListQueryBuilder';
import { KeywordRepository } from '@root/api/keyword/repositories/keyword.repository';
import { VideoUserRepository } from '../repositories/videoUserView.repository';
import { FindVideoDetailQueryBuilder } from '../repositories/queryBuilder/videoDetailQueryBuilder';
import { Video } from '@root/database/entities/video.entity';

export class VideoCommon {
  // 유튜브에서 쿼리값을 객체로 변환
  static youtubeSeperateQuery(query: string) {
    type queryType = {
      v : string;
    };
    const result: queryType = { v: null };
    query.split('&').forEach((element) => {
      const sep_element = element.split('=');
      result[sep_element[0]] = sep_element[1];
    });
    return { v: result.v };
  }

  // 유튜브에서 받아온 시간을 시간, 분, 초로 변환
  static convertDuration(timeTypePt: string) {
    if (!timeTypePt) {
      return;
    }
    const timeRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = timeTypePt.match(timeRegex);

    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;

    return { hours, minutes, seconds };
  }

  // 유튜브 링크에서 도메인, 쿼리 등을 추출
  static findDomain(uri: string) {
    const uriObj = parseUrl(uri);
    const query = this.youtubeSeperateQuery(uriObj.query);
    return {
      youtubeUri: uriObj.fullDomain + `?v=` + query.v,
      host: uriObj.host,
      query,
    };
  }
}

class YoutubeService {
  private videoListData: VideoListItemDto[] = [];

  private readonly youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });

  get getVideoListData() {
    return this.videoListData;
  }

  private async findYoutubeChannelData(channelId: string):
    Promise<{
        videoChannelTitle: string;
        videoChannelDescription: string;
        videoChannelThumbnail: string;
        videoChannelCountry: string;
      }>
    { 
    const youtubeChannelData = await this.youtube.channels.list({
      part: ['snippet', 'contentDetails'],
      id: [channelId],
    });
    const item = youtubeChannelData.data.items[0].snippet;
    return {
      videoChannelTitle: item.title,
      videoChannelDescription: item.description,
      videoChannelThumbnail:
        item.thumbnails.default.url ?? item.thumbnails.standard.url,
      videoChannelCountry: item.country,
    };
  }

  private async findYoutubeVideoData(videoId: string): Promise<{
    videoCategoryId: string;
    tags: string[];
    videoDeaultLanguage: string;
    videoDuration: { hours?: number; minutes?: number; seconds: number };
  }>
   {
    const youtubeVideoData = await this.youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: [videoId],
    });

    const items = youtubeVideoData.data.items[0];

    return {
      videoCategoryId: items.snippet?.categoryId,
      tags: items.snippet?.tags ?? [],
      videoDeaultLanguage: items.snippet?.defaultLanguage,

      videoDuration: VideoCommon.convertDuration(
        items.contentDetails?.duration,
      ),
    };
  }

  private async findYoutubeSearchData(
    keyword: string,
    videoPageDto: VideoPageDto,
  ) {
    const youtubeSearchData = await this.youtube.search.list({
      part: ['snippet', 'id'],
      q: keyword,
      type: ['video'],
      maxResults: 30,
    });

    for (const item of youtubeSearchData.data.items) {
      await this.findYoutubeVideoData(item.id.videoId);
      this.videoListData.push({
        videoId: item.id.videoId,
        videoPublishedAt: item.snippet.publishedAt,
        videoThumbnail:
          item.snippet.thumbnails?.high.url ??
          item.snippet.thumbnails?.standard.url ??
          item.snippet.thumbnails?.medium.url ??
          item.snippet.thumbnails?.default.url,
        videoUri: `https://www.youtube.com/watch?v=` + item.id.videoId,
        videoTitle: item.snippet.title,
        videoDescription: item.snippet.description,
        videoChannelData: await this.findYoutubeChannelData(
          item.snippet.channelId,
        ),
        videoDetailData: await this.findYoutubeVideoData(item.id.videoId),
      });
    }
  }

  async findYoutubeData(keyword: string, videoPageDto: VideoPageDto): Promise<void> {
    const uri = `https://www.youtube.com/results?search_query=${keyword}`;
    const { youtubeUri, host, query } = VideoCommon.findDomain(uri);
    if (host !== 'www.youtube.com') {
      throw new BadRequestException('유튜브 URI만 등록가능합니다.');
    }
    await this.findYoutubeSearchData(keyword, videoPageDto);
  }
}

@Injectable()
export class VideoService {
  constructor(
    private videoRepository: VideoRepository,
    private keywordRepository: KeywordRepository,
    private readonly findVideoDetailQueryBuilder: FindVideoDetailQueryBuilder,
    private readonly videoListQueryBuilder :VideoListQueryBuilder,
    private readonly videoListQueryBuilderForView : VideoListQueryBuilderForView
  ) {}

  // 해당 플렛폼에서 비디오 데이터를 가져오기
  async findVideoListByPlatform(keyword: string, videoPageDto: VideoPageDto): Promise<VideoListItemDto[]> {
    switch (videoPageDto.platform) {
      case 'youtube': {
        const youtubeService = new YoutubeService();

        await youtubeService.findYoutubeData(keyword, videoPageDto);
        return youtubeService.getVideoListData;
      }
    }
  }

  // video db 아이디로 가져오기
  async findOneByVideoDbId(videoDbId: number): Promise<Video> {
    return this.findVideoDetailQueryBuilder.findOneByVideoDbId(videoDbId);
  }

  // 비디오 오리지널 아이디로 테이블에서 찾아보기
  async findOneByVideoId(videoId: string ) {
    const dupVideoData = await this.videoRepository.findOneByVideoId(
      videoId,
    );
    return dupVideoData;
  }

  async findByKeyword(keyword: string ): Promise<ResponseVideoListPageDto[]> {
    return await this.videoRepository.findByKeyword(keyword);
  }

  async findViewVideoByUserId(
    userId : number,
    findAllViewVidoDto: FindAllViewVidoDto,
  )
  : Promise<{videoData: VideoDataDto[], maxPageNumber: number}>  {
    let keywordId = null
    // 필터로 키워드가 들어왔을 경우
    if(findAllViewVidoDto.keyword){
      const keywordData = await this.keywordRepository.findByKeyword(findAllViewVidoDto.keyword)
      keywordId = keywordData.id
    }
    const videoData : VideoDataDto[] =  await this.videoListQueryBuilderForView.getViewVideoData(userId,keywordId, findAllViewVidoDto)
    const maxPageNumber = await this.videoListQueryBuilderForView.getMaxPageNumber(userId,keywordId, findAllViewVidoDto)
    return {videoData, maxPageNumber};
   
  }

  // 데이터베이스에 새로운 비디오 데이터 만들기
  async createVideoData(
    videoData: VideoListItemDto,
    platform: string,
  ): Promise<{ videoId: number }> {
    const dupVideoDetailData =
      await this.videoRepository.findVideoDetailByPlatformAndDefaultLanguage({
        platform,
        defaultLanguage: videoData.videoDetailData.videoDeaultLanguage,
      });
    let videoDetailId: number;
    if (dupVideoDetailData) {
      videoDetailId = dupVideoDetailData.id;
    }
    if (!dupVideoDetailData) {
      const videoDetailData = await this.videoRepository.createVideoDetail(
        platform,
        videoData.videoDetailData.videoDeaultLanguage,
      );
      videoDetailId = videoDetailData.id;
    }
    const newVideoData = await this.videoRepository.create(
      videoData,
      videoDetailId,
    );
    return { videoId: newVideoData.id };
  }

  async updateViewCount(videoDbId: number, viewCount: number) {
   
    await this.videoRepository.updateViewCount(videoDbId, viewCount);
  }
}
