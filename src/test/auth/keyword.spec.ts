import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KeywordModule } from "@root/api/keyword/keyword.module";
import { KeywordService } from "@root/api/keyword/services/keyword.service";
import { KeywordUserService } from "@root/api/keyword/services/keywordUser.service";
import { KeywordVideoService } from "@root/api/keyword/services/keywordVideo.service";
import { Config } from "@root/app.module";
import { CreateTestData, entites } from "../test.module";
import { Auth } from "@root/database/entities/auth.entity";
import { User } from "@root/database/entities/user.entity";
import { Keyword, KeywordUser } from "@root/database/entities/keyword.entity";

let keywordService : KeywordService;
let keywordUserService : KeywordUserService
let keywordVideoService : KeywordVideoService

beforeAll(async () => {
    
    const keywordTestModule: TestingModule = await Test.createTestingModule({
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
            KeywordModule, 
            TypeOrmModule.forFeature([...entites]),

        ],
        providers: [CreateTestData],
    }).compile()
    keywordService = keywordTestModule.get<KeywordService>(KeywordService);
    keywordUserService = keywordTestModule.get<KeywordUserService>(KeywordUserService);
    keywordVideoService = keywordTestModule.get<KeywordVideoService>(KeywordVideoService);

     let createTestData = keywordTestModule.get<CreateTestData>(CreateTestData);
    await createTestData.createTestData();

   

}
)

describe('키워드 생성', () => {
    it('데이터베이스에 존재하는 키워드 하나 찾아오기', async () => {
        const result = await keywordService.findByKeyword('test-keyword');
        expect(result).toBeDefined();
    })
})