import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FindAllKeywordDto } from "@root/api/keyword/dto/requestKeword.dto";
import { KeywordModule } from "@root/api/keyword/keyword.module";
import { KeywordRepository } from "@root/api/keyword/repositories/keyword.repository";
import { FindAllKeywordQueryBuilder, FindAllRecomendedKeywordQueryBuilder } from "@root/api/keyword/repositories/queryBuilder/findAll.queryBuilder";
import { KeywordService } from "@root/api/keyword/services/keyword.service";
import { Config } from "@root/app.module";
import { Keyword, KeywordUser, KeywordVideo } from "@root/database/entities/keyword.entity";
import { CreateTestData, entites } from "../test.module";
import { UserRepositoyry } from "@root/api/user/repositories/user.repository";
import { FindRecommendKeywordDto } from "@root/api/keyword/dto/keyword.dto";


let keywordService : KeywordService;
let keywordRepository : KeywordRepository;
let findAllKeywordQueryBuilder : FindAllKeywordQueryBuilder;
let findAllRecomendedKeywordQueryBuilder : FindAllRecomendedKeywordQueryBuilder;

beforeAll(async () => {
    const keywordServiceTestModule: TestingModule = await Test.createTestingModule({
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
            TypeOrmModule.forFeature([...entites ]),

        ],
        providers: [
            KeywordService,
            KeywordRepository,
            FindAllKeywordQueryBuilder,
            FindAllRecomendedKeywordQueryBuilder,
            UserRepositoyry,
            
        ],
    }).compile();

    keywordService = keywordServiceTestModule.get<KeywordService>(KeywordService);
    keywordRepository = keywordServiceTestModule.get<KeywordRepository>(KeywordRepository);
    findAllKeywordQueryBuilder = keywordServiceTestModule.get<FindAllKeywordQueryBuilder>(FindAllKeywordQueryBuilder);
    findAllRecomendedKeywordQueryBuilder = keywordServiceTestModule.get<FindAllRecomendedKeywordQueryBuilder>(FindAllRecomendedKeywordQueryBuilder);
})

describe('findAll', () => {
    it(`모든 키워드 조회` , async () => {
        const findAllKeywordDto : FindAllKeywordDto = {
            keyword : '',
            page : 1,
            limit : 10
        }
        findAllKeywordQueryBuilder.findAll = jest.fn().mockResolvedValue([]);
        const result = await keywordService.findAll(
            1, findAllKeywordDto
        );
        expect(result).toEqual([]);
    })
})

describe('findAllByUserId', () => {
    it(`userId를 이용해 키워드를 찾을 수 있어야함.` , async () => {
        
       keywordRepository.findAllByUserId = jest.fn().mockResolvedValue([{
        keyword: 'test',
        keywordId : 1
       }]);

        const result = await keywordService.findAllByUserId(
            1
        );
        expect(result).toEqual([{
            keyword: 'test',
            keywordId : 1
        }]);
    })
})

describe('findAllRecomendedKeyword', () => {
    
    it(`추천 키워드를 조회할 수 있어야함. (recent)` , async () => {
        findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword = jest.fn().mockResolvedValue([]);
        const result = await findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword(
            1,
            {
                limit : 10,
                recomendType : 'recent'
            }
        );
        expect(result).toEqual([]);
    })
    it(`추천 키워드를 조회할 수 있어야함. (popular)` , async () => {
        findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword = jest.fn().mockResolvedValue([]);

        const result = await findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword(
            1,
            {
                 limit : 10,
                recomendType : 'popular'
            }
        );
        expect(result).toEqual([]);
    })
    it(`추천 키워드를 조회할 수 있어야함. (recommend)` , async () => {
        findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword = jest.fn().mockResolvedValue([]);

        const result = await findAllRecomendedKeywordQueryBuilder.findAllRecomendedKeyword(
            1,
            {
                 limit : 10,
                recomendType : 'recommend'
            }
        );
        expect(result).toEqual([]);
    })
})