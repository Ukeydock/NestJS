import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule, Config } from "@root/app.module";
import { CreateTestData, entites } from "../test.module";
import { INestApplication } from "@nestjs/common";
import { AuthController } from "@root/api/auth/auth.controller";
import * as request from 'supertest';
import { KeywordController } from "@root/api/keyword/controllers/keyword.controller";
import { createTestingModule } from "./e2e-testModule";

let authController : AuthController;
let keywordController : KeywordController;

// 유저가 회원가입을 하고, 닉네임, 성별, 생일을 변경하고, 변경된 정보를 조회하는 테스트
// 메인페이지에 처음 들어오면 추천키워드를 받을 수 있어야함.
// 이 테스트에서는 userController와 authController를 테스트함.

describe(`signup`, () => {
    let app : INestApplication
    let appToken : string
    beforeAll(async () => {
        app = await createTestingModule()

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
