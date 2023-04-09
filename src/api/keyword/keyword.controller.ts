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
import { KeywordService } from './keyword.service';
import { RequestKeywordDto } from './dto/requestKeword.dto';
import { ResponseKeywordDto } from './dto/responseKeword.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Keyword')
@Controller('keyword')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

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
