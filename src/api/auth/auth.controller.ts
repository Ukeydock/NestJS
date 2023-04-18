import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { authApiOperationDescription } from '@root/admin.api/document/auth.document';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '소셜로그인 구글',
    description: authApiOperationDescription.createGoolgeUser,
  })
  @Get('/google/login')
  구글소셜로그인() {}

  @Get('/google/callback')
  구글콜백() {}

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
