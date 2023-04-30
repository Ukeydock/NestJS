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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { authApiOperationDescription } from '@root/admin.api/document/auth.document';
import { Response } from 'express';
import { GoogleAuthGuard } from './google/google.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: '소셜로그인 구글',
    description: authApiOperationDescription.createGoolgeUser,
  })
  @Get('/google/login')
  execGoogleSocialLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  execGoogleSocialLoginCallback(@Req() req, @Res() res: Response) {
    console.log(req.user);
    res.redirect(
      `http://localhost:4000/auth/social/callback?accessToken=${req.user.appToken}`,
    );
  }

  @ApiOperation({
    summary: '소셜로그인 트위치',
    description: authApiOperationDescription.createTwitchUser,
  })
  @Get('/auth/twitch/login')
  트위치소셜로그인() {}

  트위치콜백() {}

  @ApiOperation({
    summary: '유저 탈퇴',
    description: authApiOperationDescription.deleteUser,
  })
  @Delete('/user/:userId')
  유저탈퇴() {}

  @Get('/')
  @Render('index.ejs')
  test(@Body() body) {
    console.log(body);
    return { name: '권영' };
  }

  @Get('/signup')
  @Render('signup.ejs')
  signup() {
    return { name: '권영' };
  }
}
