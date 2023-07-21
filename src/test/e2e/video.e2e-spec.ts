import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { createTestingModule } from "./e2e-testModule";
import * as request from 'supertest';


describe('KeywordController (e2e)', () => {
    let app : INestApplication
    let appToken : string
    beforeAll(async () => {
         app = await createTestingModule()
    })

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

    it(`비디오의 상세페이지를 조회할 수 있어야함.`, async () => {
        const response = await request(app.getHttpServer())
            .get('/video/@1')
            .set('Authorization', `Bearer ${appToken}`)
        // console.log(response.body)
        // expect(videoId).toBe("test-video-id")
        // expect(title).toBe("test-video")
    })

    it(`로그인한 유저가 비디오 상세페이지를 조회하면 조회 데이터가 남아야함.`, async () => {
        const response = await request(app.getHttpServer())
            .post('/view/@1')
            .set('Authorization', `Bearer ${appToken}`)

        expect(response.status).toBe(201);
    })

    it(`조회수가 1인 상태로 조회할 수 있어야함.`, async () => {
        const response = await request(app.getHttpServer())
            .get('/video/@1')
            .set('Authorization', `Bearer ${appToken}`)

        const {videoViewCount} = response.body
        expect(videoViewCount).toBe(1)
    })

    it(`키워드에 따른 비디오를 조회할 수 있어야함.`, async () => {
        const response = await request(app.getHttpServer())
            .get('/video/test-keyword')
            .set('Authorization', `Bearer ${appToken}`)
        
            // DB에 키워드가 존재하고 연결된 비디오가 있다면 비디오를 반환
            // 테스트의 경우는 1개이지만 실제로는 여러개가 될 수 있음.
        expect(response.body.videoData.length).toBe(1)

        const response2 = await request(app.getHttpServer())
            .get('/video/test')
            .set('Authorization', `Bearer ${appToken}`)
        
        // DB에 존재하지 않는 키워드는 빈 배열을 반환해야함.
        expect(response2.body.videoData.length).toBe(0)
    })

})