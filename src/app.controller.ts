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
  RequestMovieListPageDto,
  RequestUpdateUserDto,
  RequestUserListPageDto,
  RequestVideoListPageDto,
  ResponseKeywordDto,
  ResponseUserListPageDto,
  ResponseVideoListPageDto,
  RequestVideoDetailPageDto,
  ResponseVideoDetailPageDto,
} from './dtos';

@Controller('user')
@ApiTags('User')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: '소셜로그인 구글',
    description:
      'redirect frontDomain + auth/google/callback?accessToken=token',
  })
  @ApiBody({})
  @Get('/auth/google/login')
  구글소셜로그인() {}

  @ApiOperation({
    summary: '소셜로그인 트위치',
    description:
      'redirect frontDomain + auth/twitch/callback?accessToken=token',
  })
  @ApiBody({})
  @Get('/auth/twitch/login')
  트위치소셜로그인() {}

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
  @ApiResponse({
    status: 200,
    type: ResponseUserListPageDto,
    description: '모든 데이터는 배열로 반환됩니다.',
  })
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
    summary: '키워드 추가',
    description: '키워드를 추가',
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
  // @ApiBody({})
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
  @ApiQuery({ type: RequestVideoListPageDto })
  @ApiResponse({ type: ResponseVideoListPageDto })
  @Get('/video/:keyword')
  비디오검색리스트출력() {}

  @ApiOperation({
    summary: '비디오 상세 페이지',
    description: '비디오 상세 페이지',
  })
  @ApiBody({ type: RequestVideoDetailPageDto })
  @ApiResponse({ type: ResponseVideoDetailPageDto })
  @Get('/video/:videoUniqueId')
  비디오상세페이지조회() {}

  @ApiOperation({
    summary: '영화 리스팅 페이지',
    description: '영화 리스팅 페이지',
  })
  @ApiQuery({ type: RequestMovieListPageDto })
  @ApiResponse({ type: ResponseVideoListPageDto })
  @Get('/video/:keyword')
  영화검색리스트() {}

  @ApiOperation({
    summary: '영화 키워드 추천',
    description:
      '넷플릭스, 또는 영화진흥위원회 등의 인기순위를 이용해 유저에게 영화 관련 키워드를 추천',
  })
  @ApiResponse({ type: ResponseKeywordDto })
  영화키워드추천() {}
}

@Controller('comment')
@ApiTags('Comment')
export class CommentController {}
