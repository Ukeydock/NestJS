import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindUserByUserIdDto,
  FindUserListPageDto,
  UpdateUserDto,
} from './dto/requestUser.dto';
import { ResponseUserListPageDto } from './dto/responseUser.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CommonResponseDto } from '@root/api/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';



@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('appToken')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(`/keyword/:keywordId`)
  async findUserSubscribedKeywordList(
    @Query() findUserListPageDto: FindUserListPageDto,
    @Param() param: { keywordId: number },
  ) {
    const userListData = await this.userService.findUserSubscribedKeywordList(
      findUserListPageDto,
      param.keywordId,
    );

    return new CommonResponseDto('', { userListData });
  }

  @ApiOperation({
    summary: '유저 리스팅페이지',
    description: '유저 리스팅페이지',
  })
  @ApiResponse({
    status: 200,
    type: ResponseUserListPageDto,
    description: '모든 데이터는 배열로 반환됩니다.',
  })
  @Get('/')
  async findUserList(@Query() findUserListPageDto: FindUserListPageDto) {
    const userListData = await this.userService.findUserList(
      findUserListPageDto,
    );

    return new CommonResponseDto('', { userListData });
  }

  @Get('/[@]:userId')
  async findOneByUserId(
    @Req() req,
    @Param() findUserByUserIdDto: FindUserByUserIdDto,
  ) {
    const userId =
      findUserByUserIdDto.userId == 0
        ? req.user.userId
        : findUserByUserIdDto.userId;


    const userData = await this.userService.findOneByUserId({ userId });
    return new CommonResponseDto('유저 정보 하나 출력', { userData });
  }

  @ApiOperation({
    summary: '유저정보 변경(test)',
    description: `유저의 정보 변경, 변경을 원하는 정보만 객체에 넣어 보내주시면 됩니다. 
      <br> 예를 들어 birthday만 보내고 싶다면 body에 {birthday : xxx} 만 보내주시면 됩니다.
    `,
  })
  @ApiBody({ type: UpdateUserDto })
  @Put('/')
  async updateUserById(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const { userId } = req.user;
    console.log(userId)
    await this.userService.updateById(userId, updateUserDto);
    return new CommonResponseDto('user status');
  }


  // 0610 현재 프로파일 이미지를 가져오는 중. (s3로 넘기는걸 구현해야함)
  @ApiOperation({
    summary: '유저 프로필 이미지 변경',
    description: `유저의 프로필 이미지를 변경합니다. `,
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  @Post(`/profile`)
  async updateProfileImage(@Req() req, @UploadedFile() file) {
    const { userId } = req.user;

    // await this.userService.updateById(userId, { avatar: file.filename });
    return new CommonResponseDto('user status');
  }
}





@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({
    summary: '즐겨찾기 추가/ 삭제',
    description: '즐겨찾기',
  })
  @Post('/user/bookmark/:videoUniqueId')
  비디오즐겨찾기관리() { }
}

