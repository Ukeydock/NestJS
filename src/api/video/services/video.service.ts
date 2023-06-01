import { google } from 'googleapis';

import { BadRequestException, Injectable } from '@nestjs/common';
import { VideoPageDto } from '../dto/requestVideo.dto';
import { parseUrl } from 'url-lib';

import {
  FindVideoDetailQueryBuilder,
  VideoRepository,
} from '../repositories/video.repository';
import { VideoListItemDto } from '../dto/responseVideo.dto';

class VideoCommon {
  static youtubeSeperateQuery(query) {
    type queryType = {
      v;
    };
    const result: queryType = { v: null };
    query.split('&').forEach((element) => {
      const sep_element = element.split('=');
      result[sep_element[0]] = sep_element[1];
    });
    return { v: result.v };
  }

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

  private async findYoutubeChannelData(channelId: string) {
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

  private async findYoutubeVideoData(videoId: string) {
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
    console.log(this.videoListData[0].videoDetailData);
  }

  async findYoutubeData(keyword: string, videoPageDto: VideoPageDto) {
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
    private readonly findVideoDetailQueryBuilder: FindVideoDetailQueryBuilder,
  ) {}

  // 해당 플렛폼에서 비디오 데이터를 가져오기
  async findVideoListByPlatform(keyword: string, videoPageDto: VideoPageDto) {
    switch (videoPageDto.platform) {
      case 'youtube': {
        const youtubeService = new YoutubeService();

        await youtubeService.findYoutubeData(keyword, videoPageDto);
        return youtubeService.getVideoListData;
      }
    }
  }

  // video db 아이디로 가져오기
  async findOneByVideoDbId(videoDbId: number) {
    return this.findVideoDetailQueryBuilder.findOneByVideoDbId(videoDbId);
  }

  // 비디오 오리지널 아이디로 테이블에서 찾아보기
  async findOneByVideoId(findOneByVideoIdDto: { videoId: string }) {
    const dupVideoData = await this.videoRepository.findOneByVideoId(
      findOneByVideoIdDto.videoId,
    );
    return dupVideoData;
  }

  async findByKeyword(findByKeywordDto: { keyword: string }) {
    return await this.videoRepository.findBykeyword(findByKeywordDto);
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
}
