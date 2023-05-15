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

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('appToken')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

    await this.userService.updateById(userId, updateUserDto);
    return new CommonResponseDto('user status');
  }

  @ApiOperation({
    summary: '유저 리스팅페이지',
    description: '유저 리스팅페이지',
  })
  @ApiQuery({ type: FindUserListPageDto })
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
