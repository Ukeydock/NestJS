import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Config } from "@root/app.module";
import { CreateTestData, entites } from "../test.module";
import { VideoModule } from "@root/api/video/video.module";
import { KeywordRepository } from "@root/api/keyword/repositories/keyword.repository";
import { VideoRepository } from "@root/api/video/repositories/video.repository";

let videoRepository : VideoRepository;
beforeAll(async () => {
    
    const videoRepositoryTestModule: TestingModule = await Test.createTestingModule({
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
            TypeOrmModule.forFeature([...entites]),

        ],
        providers: [CreateTestData],
    }).compile()

    videoRepository = videoRepositoryTestModule.get<VideoRepository>(VideoRepository);
     let createTestData = videoRepositoryTestModule.get<CreateTestData>(CreateTestData);
    await createTestData.createTestData();

   

}
)

describe(`findByKeyword`, () => {
    it(`findByKeyword : 키워드로 비디오를 검색할 수 있어야함.`, async () => {
        videoRepository.findByKeyword = jest.fn().mockResolvedValue([
            {
                id: 1,
                keyword: "test",
                count : 1,
            }
        ])
    })
})