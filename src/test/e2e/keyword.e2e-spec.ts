import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule, Config } from "@root/app.module";
import { CreateTestData, entites } from "../test.module";
import * as request from 'supertest';
import { KeywordUserController } from "@root/api/keyword/controllers/keywordUser.controller";
import { createTestingModule } from "./e2e-testModule";

// 이 테스트에서는 keywordController 와 keywordUserController를 테스트함.

let keywordUserController : KeywordUserController;

describe('KeywordController (e2e)', () => {
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

    it(`키워드 구독하기`, async () => {
        const response = await request(app.getHttpServer())
            .post('/keyword-user/1')
            .set('Authorization', `Bearer ${appToken}`)

        expect(response.status).toBe(201);

        const response2 = await request(app.getHttpServer())
            .post('/keyword-user/2')
            .set('Authorization', `Bearer ${appToken}`)
        
        expect(response2.status).toBe(201);
    })

    it(`키워드 아이디를 이용해 로그인한 유저가 이 키워드를 구독했는지 확인할 수 있어야함.`, async () => {
        const response = await request(app.getHttpServer())
            .get('/keyword-user/@1')
            .set('Authorization', `Bearer ${appToken}`)
        
        expect(response.body).toBeDefined()

        // 등록하지 않았으면 유저정보를 찾을 수 없어야한다.
        const response2 = await request(app.getHttpServer())
            .get('/keyword-user/@3')
            .set('Authorization', `Bearer ${appToken}`)
        
        expect(response2.body).toEqual({})
    })

    it(`키워드 아이디를 이용해 로그인한 유저가 이 키워드를 구독을 취소할 수 있어야함.`, async () => {
        const response = await request(app.getHttpServer())
            .delete('/keyword-user/@1')
            .set('Authorization', `Bearer ${appToken}`)
        
        expect(response.status).toBe(200);
    })

    it(`사용자는 내가 등록한 키워드라면 메인 키워드로 변경할 수 있어야함.`, async () => {
        const response = await request(app.getHttpServer())
            .patch('/keyword-user/main/@2')
            .set('Authorization', `Bearer ${appToken}`)
        
        expect(response.status).toBe(200);
    })

    it(`특정 유저의 구독한 키워드를 확인할 수 있어야함.`, async () => {
        const response = await request(app.getHttpServer())
            .get('/keyword/@0')
            .set('Authorization', `Bearer ${appToken}`)
        expect(response.body[0]).toMatchObject({
            keyword : expect.any(String),
            keywordId : expect.any(Number),
        })
        expect(response.body.length).toBe(1);
    })
    

})