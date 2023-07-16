import { describe } from "node:test";
import { setTestModule } from "../test.module";
import { AuthService, AuthSocialLoginService } from "@root/api/auth/auth.service";
import { AppModule, Config } from "@root/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "@root/api/auth/auth.module";
import { getConnection } from "typeorm";

let authService : AuthService;
let authSocialLoginService : AuthSocialLoginService;

beforeAll(async () => {
   
    const testModule = await setTestModule()
    authService = testModule.get<AuthService>(AuthService);
    authSocialLoginService = testModule.get<AuthSocialLoginService>(AuthSocialLoginService);
}
)

describe('소셜로그인', () => {
    //
    it('정상적인 로그인 => 토큰을 발급받을 수 있어야함.', async () => {
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
  const connection = getConnection();
  const entities = connection.entityMetadatas;
    console.log(entities)
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.clear(); // CLEAR is like TRUNCATE, but for TypeORM
  }
});