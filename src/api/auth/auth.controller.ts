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
import { DeleteAuthByAuthIdDto } from './dto/requestAuth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: '소셜로그인 구글(완)',
    description: 'redirect frontDomain + auth/google/callback?appToken=token',
  })
  @Get('/google/login')
  execGoogleSocialLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  execGoogleSocialLoginCallback(@Req() req, @Res() res: Response) {
    res.redirect(
      `http://localhost:4000/auth/social/callback?appToken=${req.user.appToken}`,
    );
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
