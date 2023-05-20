import { Injectable } from '@nestjs/common';
import { VideoService } from '@root/api/video/services/video.service';
import { parseString } from 'xml2js';
import cheerio from 'cheerio';
import axios from 'axios';
import { CronJob } from 'node-schedule';
import { Cron } from '@nestjs/schedule';
import { KeywordService } from '@root/api/keyword/services/keyword.service';
import { KeywordVideoService } from '@root/api/keyword/services/keyword-video.service';
import { VideoTagRepository } from '@root/api/video/repositories/videoTag.repository';

@Injectable()
export class ScheduleServie {
  constructor(
    protected readonly videoService: VideoService,
    protected readonly keywordService: KeywordService,
    protected readonly keywordVideoService: KeywordVideoService,
    protected readonly videoTagRepository: VideoTagRepository,
  ) {}
  protected async createNewVideo(keyword: string) {
    console.log(keyword);
    const dupKeywordData = await this.keywordService.findByKeyword({ keyword });
    if (dupKeywordData) {
      //키워드의 최근 업데이트 날짜에 따라 영상을 새로 가져올지 결정하기
    }
    if (!dupKeywordData) {
      const newKeywordData = await this.keywordService.create({
        keyword,
      });

      const youtubeVideoData = await this.videoService.findVideoListByPlatform(
        keyword,
        {
          platform: 'youtube',
          duration: '7200',
        },
      );

      for (const videoData of youtubeVideoData) {
        try {
          const dupVideoData = await this.videoService.findOneByVideoId({
            videoId: videoData.videoId,
          });

          if (dupVideoData) {
            continue;
          }

          const { videoId } = await this.videoService.createVideoData(
            videoData,
            `youtube`,
          );

          await this.keywordVideoService.create(videoId, newKeywordData.id);
          console.log(videoData.videoDetailData.tags);
          for (const tag of videoData.videoDetailData.tags) {
            const dupTagData = await this.videoTagRepository.findByTag(tag);
            if (dupTagData) {
              await this.videoTagRepository.createVideoTagVideo(
                videoId,
                dupTagData.id,
              );
              continue;
            }
            if (!dupTagData) {
              const newVideoTagData = await this.videoTagRepository.create(tag);
              await this.videoTagRepository.createVideoTagVideo(
                videoId,
                newVideoTagData.id,
              );
            }
          }
        } catch (err) {
          console.error(err, keyword);
          continue;
        }
      }
    }
  }
}

@Injectable()
export class GoogleTrendService extends ScheduleServie {
  private async findGoogleTrendKeyword() {
    const html = await axios.get(
      `https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=KR`,
    );

    const result: any = await new Promise((resolve, reject) => {
      parseString(html.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    const items = result.rss.channel[0].item.filter((item) => {
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
      const time = new Date().getTime() - new Date(item.pubDate).getTime();
      return time < oneDayInMilliseconds;
    });
    for (const item of items) {
      try {
        await this.createNewVideo(item.title[0]);
      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }

  @Cron(`0 0 * * *`)
  public async initEachDay() {
    console.log('??');
    this.findGoogleTrendKeyword().catch((err) => {
      console.error(err);
    });

    // this.findGoogleTrendKeyword();
  }
}
