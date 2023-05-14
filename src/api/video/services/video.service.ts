import { google } from 'googleapis';

import { BadRequestException, Injectable } from '@nestjs/common';
import { VideoPageDto } from '../dto/requestVideo.dto';
import { parseUrl } from 'url-lib';
import { VideoListItemDto } from '../dto/video/video.dto';

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

  get getVideoListData() {
    return this.videoListData;
  }

  private readonly youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });

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

  private async findYoutubeSearchData(
    keyword: string,
    videoPageDto: VideoPageDto,
  ) {
    const youtubeSearchData = await this.youtube.search.list({
      part: ['snippet', 'id'],
      q: keyword,
      type: ['video'],
    });

    for (const item of youtubeSearchData.data.items) {
      this.videoListData.push({
        videoId: item.id.videoId,
        videoPublishedAt: item.snippet.publishedAt,
        videoThumbnail: item.snippet.thumbnails.default.url,
        videoUri: `https://www.youtube.com/watch?v=` + item.id.videoId,
        videoTitle: item.snippet.title,
        videoDescription: item.snippet.description,
        videoChannelData: await this.findYoutubeChannelData(
          item.snippet.channelId,
        ),
      });
    }
  }

  async findYoutubeData(keyword: string, videoPageDto: VideoPageDto) {
    const uri = `https://www.youtube.com/results?search_query=${keyword}`;
    const { youtubeUri, host, query } = VideoCommon.findDomain(uri);
    if (host !== 'www.youtube.com') {
      throw new BadRequestException('유튜브 URI만 등록가능합니다.');
    }
    await this.findYoutubeSearchData(keyword, videoPageDto);
    // console.log(youtubeItems);
    // const youtubeItemsSnippet = youtubeItems.snippet;

    // const result: VideoListItemDto[] = [];

    // const result: VideoListItemDto = {
    //   videoId: youtubeItems.id,
    //   videoThumbnail: youtubeItemsSnippet.thumbnails.standard.url,
    //   videoUri: youtubeUri,
    //   videoChannelId: youtubeItemsSnippet.channelId,
    //   videoTitle: youtubeItemsSnippet.title,
    //   videoDescription: youtubeItemsSnippet.description,
    //   videoChannelTitle: youtubeItemsSnippet.channelTitle,
    //   videoPublishedAt: youtubeItemsSnippet.publishedAt,
    //   videoChannelThumbnail:
    //     youtubeChannelData.data.items[0].snippet.thumbnails.default.url,
    // };
    // return { youtubeData: result, tags: youtubeItemsSnippet.tags };
  }
}

@Injectable()
export class VideoService {
  constructor() {}

  async findVideoListByPlatform(keyword: string, videoPageDto: VideoPageDto) {
    switch (videoPageDto.platform) {
      case 'youtube': {
        const youtubeService = new YoutubeService();

        await youtubeService.findYoutubeData(keyword, videoPageDto);
        return youtubeService.getVideoListData;
        break;
      }
    }
  }
}
