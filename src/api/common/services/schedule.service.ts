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
import { google } from 'googleapis';
import { VideoListItemDto } from '@root/api/video/dto/responseVideo.dto';
import { Movie } from '@root/database/entities/netflixMovie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScheduleServie {
  constructor(
    protected readonly videoService: VideoService,
    protected readonly keywordService: KeywordService,
    protected readonly keywordVideoService: KeywordVideoService,
    protected readonly videoTagRepository: VideoTagRepository,
    @InjectRepository(Movie)
    protected movieRepository: Repository<Movie>,
  ) {}

  private async createNewVideo(videoData: VideoListItemDto) {
    const dupVideoData = await this.videoService.findOneByVideoId({
      videoId: videoData.videoId,
    });
    if (dupVideoData) {
      return { videoId: dupVideoData.id };
    }

    const { videoId } = await this.videoService.createVideoData(
      videoData,
      `youtube`,
    );
    return { videoId };
  }

  private async createNewTag(videoId: number, tags: string[]) {
    for (const tag of tags) {
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
  }

  protected async createNewVideoByKeyword(
    keyword: string,
    searchKeyword?: string,
  ) {
    console.log('키워드', keyword);
    const dupKeywordData = await this.keywordService.findByKeyword({ keyword });
    if (dupKeywordData) {
      //키워드의 최근 업데이트 날짜에 따라 영상을 새로 가져올지 결정하기
    }
    if (!dupKeywordData) {
      const youtubeVideoData = await this.videoService.findVideoListByPlatform(
        searchKeyword ?? keyword,
        {
          platform: 'youtube',
          duration: '7200',
        },
      );

      if (!youtubeVideoData) {
        return;
      }

      const newKeywordData = await this.keywordService.create({
        keyword,
      });

      for (const videoData of youtubeVideoData) {
        try {
          console.log(
            '비디오 제목 : ',
            videoData.videoTitle,
            '비디오 키워드 : ',
            keyword,
          );
          const { videoId } = await this.createNewVideo(videoData);
          await this.createNewTag(videoId, videoData.videoDetailData.tags);

          await this.keywordVideoService.create(videoId, newKeywordData.id);
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
    // 최근 2일의 키워드를 가져오기
    const items = result.rss.channel[0].item.filter((item) => {
      const oneDayInMilliseconds = 2 * 24 * 60 * 60 * 1000;
      const time = new Date().getTime() - new Date(item.pubDate).getTime();
      return time < oneDayInMilliseconds;
    });
    for (const item of items) {
      try {
        // console.log(item);
        await this.createNewVideoByKeyword(item.title[0]);
      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }

  @Cron(`0 * * * *`)
  public async initEachDay() {
    console.log('작업', Date.now());
    this.findGoogleTrendKeyword().catch((err) => {
      console.error(err);
    });

    // this.findGoogleTrendKeyword();
  }
}

export class MovieTrendService extends ScheduleServie {
  async getMovieTrend() {
    const instance = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      params: {
        api_key: process.env.MOVIE_API_KEY,
        language: 'ko-KR',
      },
    });
    const requests = {
      fetchNowPlaying: 'movie/now_playing',
      fetchNetflixOriginals: '/discover/tv?with_networks=213&page=30',
      fetchTrending: '/trending/all/week',
      fetchTopRated: '/movie/top_rated',
      fetchActionMovies: '/discover/movie?with_genres=28',
      fetchComedyMovies: '/discover/movie?with_genres=35',
      fetchHorrorMovies: '/discover/movie?with_genres=27',
      fetchRomanceMovies: '/discover/movie?with_genres=10749',
      fetchDocumentaries: '/discover/movie?with_genres=99',
    };
    let page = 1;
    let movieCount = 0;
    while (1) {
      try {
        const movieData = await instance.get(
          requests.fetchNetflixOriginals + `&page=${page}`,
        );

        for (const movie of movieData.data.results) {
          const movieEntity = this.movieRepository.create({
            name: movie.name,
            description: movie.overview,
            originalLanguage: movie.original_language,
            originalName: movie.original_name,
          });
          movieCount += 1;
          this.movieRepository.save(movieEntity);
        }
        page += 1;
      } catch (err) {
        console.error(err.message);
        break;
      }
    }
  }

  @Cron(`0 * * * *`)
  async findVideoBy() {
    const movieFindAllQuery = this.movieRepository
      .createQueryBuilder()
      .select(`*`)
      .limit(10)
      .where(`isExistVideo = 0`);

    const movieData = await movieFindAllQuery.getRawMany();

    for (const movie of movieData) {
      try {
        await this.createNewVideoByKeyword(
          movie.name,
          `넷플릭스 ${movie.name} 몰아보기`,
        );
        await this.movieRepository.update(movie.id, { isExistVideo: true });
      } catch (err) {
        console.error(err.message);
        break;
      }
    }
  }
}

export class NaverDataLabKeyword extends ScheduleServie {
  private async findNaverDataLabKeyword() {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET_KEY;
    const api_url = 'https://openapi.naver.com/v1/datalab/search';

    const request_body = {
      startDate: '2023-05-01',
      endDate: '2023-05-20',
      timeUnit: 'date',
      keywordGroups: [
        {
          groupName: '에스파',
          keywords: ['카리나', '윈터', '닝닝', '지젤'],
        },
      ],
      device: '',
      ages: ['2', '3'],
      gender: 'f',
    };

    const naverDataLabKeywordData = await axios({
      method: 'post',
      url: api_url,
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'Content-Type': 'application/json',
      },
      data: {
        ...request_body,
      },
    });

    console.log(naverDataLabKeywordData.data.results[0]);
    console.log(naverDataLabKeywordData.data.results[1]);
  }

  async init() {
    // this.findNaverDataLabKeyword().catch((err) => console.error(err.message));
  }
}
