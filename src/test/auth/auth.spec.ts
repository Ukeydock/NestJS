import { describe } from "node:test";
import { setTestModule } from "../test.module";
import { AuthService, AuthSocialLoginService } from "@root/api/auth/auth.service";
import { AppModule, Config } from "@root/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "@root/api/auth/auth.module";

let authService : AuthService;
let authSocialLoginService : AuthSocialLoginService;
beforeEach(async () => {
   
    const testModule = await setTestModule()
    authService = testModule.get<AuthService>(AuthService);
    authSocialLoginService = testModule.get<AuthSocialLoginService>(AuthSocialLoginService);
    console.log('beforeEach')
}
)

describe('소셜로그인', () => {
    it('정상적인 로그인 => 토큰 발급', async () => {
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
    })           
})