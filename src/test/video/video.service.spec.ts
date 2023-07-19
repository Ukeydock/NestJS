import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoModule } from "@root/api/video/video.module";
import { Config } from "@root/app.module";
import { entites } from "../test.module";
import { VideoCommon, VideoService } from "@root/api/video/services/video.service";
import { KeywordRepository } from "@root/api/keyword/repositories/keyword.repository";
import { VideoListQueryBuilderForView } from "@root/api/video/repositories/queryBuilder/videoListQueryBuilder";

let videoService : VideoService;
let keywordRepository : KeywordRepository;
let videoListQueryBuilderForView : VideoListQueryBuilderForView

beforeAll(async () => {
    const videoServiceModule: TestingModule = await Test.createTestingModule({
        imports: [
            Config.setENV(),

            TypeOrmModule.forRoot({
                dropSchema: true,
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: 3306,
                username: process.env.MYSQL_USERNAME,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                entities: [`src/**/*.entity.{js,ts}`],
                synchronize: true,
                // dropSchema 옵션은 어플리케이션 구동시 스키마들을 모두 삭제함.
            }),
            VideoModule,
            TypeOrmModule.forFeature([...entites ]),

        ],
        providers: [
            
            
        ],
    }).compile();

    videoService = videoServiceModule.get<VideoService>(VideoService);
    keywordRepository = videoServiceModule.get<KeywordRepository>(KeywordRepository);
    videoListQueryBuilderForView = videoServiceModule.get<VideoListQueryBuilderForView>(VideoListQueryBuilderForView);
})

describe(`videoCommon`, () => {
    it(`youtubeSeperateQuery : 유튜브 비디오 링크중 쿼리값 v를 객체로 뽑을 수 있어야함.`, async () => {
        const result = VideoCommon.youtubeSeperateQuery('v=2mRKDQ0h1ao');
        expect(result).toMatchObject({
            v : '2mRKDQ0h1ao'
        })


    })

    it(`youtubeSeperateQuery : 두번 째 케이스, 매개변수는 링크가 아니라 쿼리값으로 들어와야함.`, () => {
         const result = VideoCommon.youtubeSeperateQuery('https://www.youtube.com/watch?v=EtE09lowIbk');
        expect(result).toMatchObject({
            v : null
        })
    })

    it(`convertDuration : 유튜브의 시간을 시, 분, 초로 변경`, () => {
        const result = VideoCommon.convertDuration('PT1H1M1S');
        expect(result).toMatchObject({
            hours : 1,
            minutes : 1,
            seconds : 1,
        })
    })

    it(`findDomain: 링크에서 도메인과 쿼리값 등을 추출`, () => {
        const result = VideoCommon.findDomain('https://www.youtube.com/watch?v=EtE09lowIbk');
        expect(result).toMatchObject({
            host: 'www.youtube.com',
            youtubeUri: `https://www.youtube.com?v=EtE09lowIbk`,
            query: {
                v: 'EtE09lowIbk'
            }
        })
    })
})

describe("findViewVideoByUserId" , () => {
    it(`유저가 본 영상을 조회할 수 있어야함.`, async () => {
        keywordRepository.findByKeyword = jest.fn().mockResolvedValue([
            {
                id: 1,
                keyword: "test",
                count : 1,
            }
        ])
        videoListQueryBuilderForView.getViewVideoData = jest.fn().mockResolvedValue([
            {
                videoId : 'test',
                videoThumbnail : 'test',
                videoDbId : 1,
                videoVideoCount : 1,
                videoTitle : 'test',
                videoDescription : 'test',
                videoCount : 1,
                videoCreatedAt : '2023-01-01',
            }       
        ])
        videoListQueryBuilderForView.getMaxPageNumber = jest.fn().mockResolvedValue(1)

        const result = await videoService.findViewVideoByUserId(1, {
            page : 1,
            limit : 1,
            order: 'DESC',
            sort: 'date',
            keyword: ''
        })
        expect(result).toMatchObject({
            videoData : [{
                videoId : 'test',
                videoThumbnail : 'test',
                videoDbId : 1,
                videoVideoCount : 1,
                videoTitle : 'test',
                videoDescription : 'test',
                videoCount : 1,
                videoCreatedAt : '2023-01-01',
            }]
            ,
            maxPageNumber : 1,
        });

    })
})