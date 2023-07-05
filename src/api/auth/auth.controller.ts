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
import { DeleteAuthByAuthIdDto } from './dto/requestAuth.dto';
import {OAuth2Client} from "google-auth-library"
import { CommonResponseDto } from '../common/dto/response.dto';
import { AuthSocialLoginService } from './auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly authSocialLoginService : AuthSocialLoginService) {}

  // @UseGuards(GoogleAuthGuard)
  // @ApiOperation({
  //   summary: '소셜로그인 구글(완)',
  //   description: 'redirect frontDomain + auth/google/callback?appToken=token',
  // })
  // @Header('Access-Control-Allow-Origin', '*') // CORS 허용
  // @Get('/google/login')
  // execGoogleSocialLogin() {
  //   return;
  // }

  // @Header('Access-Control-Allow-Origin', '*') // CORS 허용
  @Post('/google/callback')
  async execGoogleSocialLoginCallback(@Req() req,@Body() body, @Res() res: Response) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const {token} = body
  async function verify() : Promise<{email : string, snsId : string, profileImage : string}> {
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
  const {email , snsId, profileImage } = await verify()
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
    summary: '유저 탈퇴(완)',
    description: '유저 탈퇴',
  })
  @Delete('/user/:userId')
  async deleteAuthByAuthIdDto(
    @Param() deleteAuthByAuthIdDto: DeleteAuthByAuthIdDto,
  ) {
    await this.authService.deleteAuthByAuthId(deleteAuthByAuthIdDto);
    return {
      message: '탈퇴 되었습니다.',
      isAlert: true,
    };
  }
}
