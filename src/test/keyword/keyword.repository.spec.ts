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
import { KeywordRepository } from "@root/api/keyword/repositories/keyword.repository";
import { FindAllKeywordQueryBuilder } from "@root/api/keyword/repositories/queryBuilder/findAll.queryBuilder";

let keywordRepository : KeywordRepository;
let keywordQueryBuilder : FindAllKeywordQueryBuilder;
// let keywordUserService : KeywordUserService
// let keywordVideoService : KeywordVideoService

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
    keywordRepository = keywordTestModule.get<KeywordRepository>(KeywordRepository);
    keywordQueryBuilder = keywordTestModule.get<FindAllKeywordQueryBuilder>(FindAllKeywordQueryBuilder);
    // keywordUserService = keywordTestModule.get<KeywordUserService>(KeywordUserService);
    // keywordVideoService = keywordTestModule.get<KeywordVideoService>(KeywordVideoService);

     let createTestData = keywordTestModule.get<CreateTestData>(CreateTestData);
    await createTestData.createTestData();

   

}
)

describe('create', () => {
    it(`새로운 키워드 생성` , async () => {
        const newKeyword = await keywordRepository.create('new-keyword')
        expect(newKeyword).toBeDefined()

    })

    it(`이미 존재하는 키워드 생성` , async () => {
        const newKeyword = await keywordRepository.create('new-keyword')
        expect(newKeyword).toBeDefined()

    })


})

describe('findAllByUserId', () => {
    /**
     * 테스트용 데이터베이스 
     * KeywordUser {userId : 1 => keywordId : 1, keywordId : 2}
     */
    it(`1번 유저는 두개의 키워드를 등록한 상태여야함.` , async () => {
        const keywordList = await keywordRepository.findAllByUserId(1)
        expect(keywordList).toMatchObject([
            {keywordId : 1, keyword : 'test-keyword'},
            {keywordId : 2, keyword : 'test-keyword2'},
        ])
    })

    it(`2번 유저는 키워드를 등록하지 않은 상태여야함.` , async () => {
        const keywordList = await keywordRepository.findAllByUserId(2)
        expect(keywordList).toMatchObject([])
    })


})

describe('findAll', () => {
    it(`키워드 전체 조회(page가 1이고 limit이 2인경우 2개만 출력)` , async () => {
        const keywordList = await keywordQueryBuilder.findAll(
            0, {page: 1, limit : 2, keyword : ''}
        )
        expect(keywordList).toMatchObject([
            {keywordId : 1, keyword : 'test-keyword'},
            {keywordId : 2, keyword : 'test-keyword2'},
           
        ])
    })

    it(`키워드 전체 조회(page가 1이고 limit이 3인경우 3개만 출력)` , async () => {
        const keywordList = await keywordQueryBuilder.findAll(
            0, {page: 1, limit : 3, keyword : ''}
        )
        expect(keywordList).toMatchObject([
            {keywordId : 1, keyword : 'test-keyword'},
            {keywordId : 2, keyword : 'test-keyword2'},
            {keywordId : 3, keyword : 'test-keyword3'},
        ])
    })

    it(`키워드 전체조회(page가 2이고 limit이 2인경우 2개 출력, 새로 등록한 키워드도 출력되어야함.)`, async () => {
        const keywordList = await keywordQueryBuilder.findAll(
            0, {page: 2, limit : 2, keyword : ''}
        )
        expect(keywordList).toMatchObject([
            {keywordId : 3, keyword : 'test-keyword3'},
            {keywordId : 4, keyword : 'new-keyword'},
        ])
    })

    it(`userId가 1이라면 isExistKeyword(키워드 구독여부)가 true여야함.`, async () => {
        const keywordList = await keywordQueryBuilder.findAll(
            1, {page: 1, limit : 3, keyword : ''}
        )
        expect(keywordList).toMatchObject([
            {keywordId : 1, keyword : 'test-keyword', isExistKeyword: '1'},
            {keywordId : 2, keyword : 'test-keyword2', isExistKeyword: '1'},
            {keywordId : 3, keyword : 'test-keyword3', isExistKeyword: '0'},
        ])
    })

    it(`userId가 2라면 isExistKeyword(키워드 구독여부)가 false여야함.`, async () => {
        const keywordList = await keywordQueryBuilder.findAll(
            2, {page: 1, limit : 3, keyword : ''}
        )
        expect(keywordList).toMatchObject([
            {keywordId : 1, keyword : 'test-keyword', isExistKeyword: '0'},
            {keywordId : 2, keyword : 'test-keyword2', isExistKeyword: '0'},
            {keywordId : 3, keyword : 'test-keyword3', isExistKeyword: '0'},
        ])
    })

    it(`keyword가 값이 존재한다면 해당 keyword를 포함하는 결과가 출력되어야함.` , async () => {
        const keywordList = await keywordQueryBuilder.findAll(
            0, {page: 1, limit : 3, keyword : 'test-keyword'}
        )
        expect(keywordList).toMatchObject([
            {keywordId : 1, keyword : 'test-keyword'},
            {keywordId : 2, keyword : 'test-keyword2'},
            {keywordId : 3, keyword : 'test-keyword3'},
        ])
    })
})
