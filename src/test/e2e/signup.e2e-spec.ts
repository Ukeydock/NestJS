import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule, Config } from "@root/app.module";
import { CreateTestData, entites } from "../test.module";
import { INestApplication } from "@nestjs/common";
import { AuthController } from "@root/api/auth/auth.controller";
import * as request from 'supertest';
import { KeywordController } from "@root/api/keyword/controllers/keyword.controller";

let authController : AuthController;
let keywordController : KeywordController;

describe(`signup`, () => {
    let app : INestApplication
    let appToken : string
    beforeAll(async () => {
        const TestingModule: TestingModule = await Test.createTestingModule({
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
                AppModule,
                TypeOrmModule.forFeature([...entites ]),
            
    
            ],
            providers: [CreateTestData],

        }).compile()

        authController = TestingModule.get<AuthController>(AuthController);
        keywordController = TestingModule.get<KeywordController>(KeywordController);

        let createTestData = TestingModule.get<CreateTestData>(CreateTestData);
        await createTestData.createTestData();

        app = TestingModule.createNestApplication();
        await app.init();
    }
    );


    it(`회원가입`, async () => {
        

        const response = await request(app.getHttpServer())
            .post('/auth/google/callback')
            
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            message : expect.any(String),
            data : {
                appToken : expect.any(String),
                existNickname: false
            },
            isAlert: false

        })
        // response에서 받은 appToken을 app에 적용하기
        appToken = response.body.data.appToken;
    })

    it(`유저정보 변경하기`, async () => {
        const response = await request(app.getHttpServer())
        .put('/user')
        .set('Authorization', `Bearer ${appToken}`)
        .send({
            gender: 'man',
            nickname: 'testNickname',
            birthday: '1990-01-01',
        })
        
        expect(response.body).toMatchObject({
            message: expect.any(String),
            
        })
    })

        it(`유저정보 조회하기(변경된 정보가 적용되어야함.)`, async () => {
            const response = await request(app.getHttpServer())
            .get('/user/@0')
            .set('Authorization', `Bearer ${appToken}`)

            const result = response.body.data.userData;

            expect(result.userNickname).toBe('testNickname');
            expect(result.userBirthday).toBe('1990-01-01');
            expect(result.userGender).toBe('man')
        })

        it(`로그인한 유저에게 추천키워드가 적용되어야함.`, async () => {
            const recentResponse = await request(app.getHttpServer())
            .get('/keyword/recommend')
            .query({
                limit: 10,
                recommendType: 'recent'
            })
            .set('Authorization', `Bearer ${appToken}`)

            const result = recentResponse.body

            expect(result).toBeDefined();

            const popularResponse = await request(app.getHttpServer())
            .get('/keyword/recommend')
            .query({
                limit: 10,
                recommendType: 'popular'
            })
            .set('Authorization', `Bearer ${appToken}`)

            const result2 = popularResponse.body

            expect(result2).toBeDefined();

            const recommendResponse = await request(app.getHttpServer())
            .get('/keyword/recommend')
            .query({
                limit: 10,
                recommendType: 'recommend'
            })
            .set('Authorization', `Bearer ${appToken}`)

            const result3 = recommendResponse.body

            expect(result3).toBeDefined();
        })



})
