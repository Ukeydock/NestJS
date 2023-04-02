import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RequestKeywordDto,
  RequestUserListPageDto,
  RequestVideoListPageDto,
  ResponseKeywordDto,
  ResponseVideoListPageDto,
} from './dtos';

@Controller('user')
@ApiTags('User')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: '소셜로그인 구글',
    description: 'redirect frontDomain + auth/google/login?accessToken=token',
  })
  @ApiBody({})
  @Get('/auth/google/login')
  구글소셜로그인() {}

  @ApiOperation({
    summary: '소셜로그인 트위치',
    description: 'redirect frontDomain + auth/twitch/login?accessToken=token',
  })
  @ApiBody({})
  @Get('/auth/twitch/login')
  트위치소셜로그인() {}

  @ApiOperation({
    summary: '유저정보 변경',
    description: '유저의 정보 변경',
  })
  @ApiBody({})
  @Put('/user/:userId')
  유저정보변경() {}

  @ApiOperation({
    summary: '유저 탈퇴',
    description: '유저 탈퇴',
  })
  @ApiBody({})
  @Delete('/user/:userId')
  유저탈퇴() {}

  @ApiOperation({
    summary: '유저 리스팅페이지',
    description: '유저 리스팅페이지',
  })
  @ApiQuery({ type: RequestUserListPageDto })
  @Get('/user/:userId')
  유저리스팅페이지() {}

  @ApiOperation({
    summary: '즐겨찾기 추가/ 삭제',
    description: '즐겨찾기',
  })
  @Post('/user/bookmark/:videoUniqueId')
  비디오즐겨찾기관리() {}
}

@Controller('keyword')
@ApiTags('Keyword')
export class KeywordController {
  @ApiOperation({
    summary: '키워드 입력',
    description: '키워드 입력',
  })
  @ApiBody({ type: RequestKeywordDto })
  @Post('/keyword')
  키워드등록() {}

  @ApiOperation({
    summary: '키워드 수정',
    description: '키워드 수정',
  })
  @ApiBody({ type: RequestKeywordDto })
  @Put('/keyword/:keywordId')
  키워드수정() {}

  @ApiOperation({
    summary: '키워드 삭제',
    description: '키워드 삭제',
  })
  @ApiBody({ type: RequestKeywordDto })
  @Put('/keyword/:keywordId')
  키워드삭제() {}

  @ApiOperation({
    summary: '해당 유저의 키워드 전체 조회',
    description: '해당 유저의 키워드 전체 조회',
  })
  @ApiBody({})
  @ApiResponse({ type: ResponseKeywordDto })
  @Get('/keyword/list/:userId')
  키워드조회() {}

  @ApiOperation({
    summary: '키워드의 count와 다른 알고리즘을 이용해 추천 키워드 ',
    description: '키워드의 count와 다른 알고리즘을 이용해 추천 키워드',
  })
  @ApiBody({})
  @ApiResponse({ type: ResponseKeywordDto })
  @Get('/keyword/list/recommend')
  추천키워드조회() {}

  @ApiOperation({
    summary: '인기키워드',
    description: '인기키워드',
  })
  @ApiBody({})
  @ApiResponse({ type: ResponseKeywordDto })
  @Get('/keyword/list/popular')
  인기키워드조회() {}
}
@Controller('video')
@ApiTags('Video')
export class VideoController {
  @ApiOperation({
    summary: '비디오 리스팅 페이지',
    description: '비디오 리스팅 페이지',
  })
  @ApiBody({ type: RequestVideoListPageDto })
  @ApiResponse({ type: ResponseVideoListPageDto })
  @Get('/video/:keyword')
  비디오검색리스트출력() {}
}

@Controller('comment')
@ApiTags('Comment')
export class CommentController {}
