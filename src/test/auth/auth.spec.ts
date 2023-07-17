import { describe } from "node:test";
import { AuthService, AuthSocialLoginService } from "@root/api/auth/auth.service";
import { AppModule, Config } from "@root/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "@root/api/auth/auth.module";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateTestData, entites } from "../test.module";
import { User } from "@root/database/entities/user.entity";
import { Type } from "class-transformer";
import { Auth } from "@root/database/entities/auth.entity";
import { Keyword, KeywordUser } from "@root/database/entities/keyword.entity";


let authService : AuthService;
let authSocialLoginService : AuthSocialLoginService;



beforeAll(async () => {
    
    const authTestModule: TestingModule = await Test.createTestingModule({
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
            AuthModule, 
            // 모든 entity 등록
            // TypeOrmModule.forFeature([Auth, User]),
            TypeOrmModule.forFeature([...entites]),

        ],
        providers: [CreateTestData],
    }).compile()
    authService = authTestModule.get<AuthService>(AuthService);
    authSocialLoginService = authTestModule.get<AuthSocialLoginService>(AuthSocialLoginService);

    let createTestData = authTestModule.get<CreateTestData>(CreateTestData);
    await createTestData.createTestData();
}
)

describe('소셜로그인', () => {
    //
    it('처음 가입하는 유저 => 토큰을 발급받을 수 있어야함.', async () => {
        const result = await authSocialLoginService.execSocialLogin({
            email: "test@example.com",
            snsId: "123456789",
            profileImage: "https://example.com",
            platform: "test",
        })
        expect(result).toMatchObject({
            appToken: expect.any(String),
            existNickname: expect.any(Boolean),
        })
        // 처음 가입하는 유저라면 닉네임이 없을 것이다.
        expect(result.existNickname).toBe(false)
    })      
    
    it('데이터베이스에 이메일이 있다면 가입이 되어있던 유저임. => 토큰을 발급받고 existNickname == true', async () => {
        const result = await authSocialLoginService.execSocialLogin({
            email: "test@example.com",
            snsId: "123456789",
            profileImage: "https://example.com",
            platform: "test",
        })
        expect(result).toMatchObject({
            appToken: expect.any(String),
            existNickname: expect.any(Boolean),

        })
        expect(result.existNickname).toBe(true)
    })

})

afterAll(async () => {

});


