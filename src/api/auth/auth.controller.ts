import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
  UseGuards,
  Req,
  Header,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { authApiOperationDescription } from '@root/admin.api/document/auth.document';
import { Response } from 'express';
import { GoogleAuthGuard } from './google/google.guard';
import {OAuth2Client} from "google-auth-library"
import { CommonResponseDto } from '../common/dto/response.dto';
import { AuthSocialLoginService } from './auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly authSocialLoginService : AuthSocialLoginService) {}


  // ssl 인증을 위한 라우터 
  @Get('ssl')
  ssl(@Res() res: Response) {
    res.status(200).send('ok');
  }


  @Post('/google/callback')
  async execGoogleSocialLogin(@Body() body : {token : string}, @Res() res: Response) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const {token} = body
  const verify = async() : Promise<{email : string, snsId : string, profileImage : string}>=> {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {email : payload.email , snsId : payload.sub, profileImage : payload.picture}

  
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  }
  const {email , snsId, profileImage } = 
    process.env.NODE_ENV == "test" ? {email : 'test@example.com', snsId: '123456789', profileImage : 'test-image'}: await verify()
  const {appToken , existNickname} = await this.authSocialLoginService.execSocialLogin({email : email ,snsId : snsId, profileImage : profileImage, platform : 'google' })

    
  res.status(200).json(new CommonResponseDto("google social login", {appToken,existNickname}))
  }

  // @ApiOperation({
  //   summary: '소셜로그인 트위치',
  //   description: authApiOperationDescription.createTwitchUser,
  // })
  // @Get('/auth/twitch/login')
  // 트위치소셜로그인() {}

  // 트위치콜백() {}

  @ApiOperation({
    summary: '유저 탈퇴',
    description: '유저 탈퇴',
  })
  @Delete('/user/:userId')
  async deleteAuthByAuthIdDto(
    @Param() authId : number,
  ) {
    await this.authService.deleteByAuthId(authId);
    return {
      message: '탈퇴 되었습니다.',
      isAlert: true,
    };
  }
}
