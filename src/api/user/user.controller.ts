import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RequestUpdateUserDto,
  RequestUserListPageDto,
} from './dto/requestUser.dto';
import { ResponseUserListPageDto } from './dto/responseUser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저정보 변경',
    description: `유저의 정보 변경, 변경을 원하는 정보만 객체에 넣어 보내주시면 됩니다. 
      <br> 예를 들어 age만 보내고 싶다면 body에 {age : 25} 만 보내주시면 됩니다.
    `,
  })
  @ApiBody({ type: RequestUpdateUserDto })
  @Put('/user/:userId')
  유저정보변경() {}

  @ApiOperation({
    summary: '유저 리스팅페이지',
    description: '유저 리스팅페이지',
  })
  @ApiQuery({ type: RequestUserListPageDto })
  @ApiResponse({
    status: 200,
    type: ResponseUserListPageDto,
    description: '모든 데이터는 배열로 반환됩니다.',
  })
  @Get('/user/:userId')
  유저리스팅페이지() {}
}

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '즐겨찾기 추가/ 삭제',
    description: '즐겨찾기',
  })
  @Post('/user/bookmark/:videoUniqueId')
  비디오즐겨찾기관리() {}
}
