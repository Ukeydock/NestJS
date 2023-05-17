import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { KeywordService } from './services/keyword.service';
import { CreateKeywordDto } from './dto/requestKeword.dto';
import { ResponseKeywordDto } from './dto/responseKeword.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { KeywordUserService } from './services/keyword-user.service';

@ApiTags('Keyword')
@Controller('keyword')
@UseGuards(JwtAuthGuard)
export class KeywordController {
  constructor(
    private readonly keywordService: KeywordService,
    private readonly keywordUserService: KeywordUserService,
  ) {}

  @ApiOperation({
    summary: '키워드 추가',
    description: '키워드를 추가',
  })
  @ApiBody({ type: CreateKeywordDto })
  @Post('/')
  async create(@Req() req, @Body() body: CreateKeywordDto) {
    const userId = req.user.userId;
    const newKeywordData = await this.keywordService.create(body);
    await this.keywordUserService.create({
      userId,
      keywordId: newKeywordData.id,
    });
    return { message: '성공!' };
  }

  @ApiOperation({
    summary: '키워드 수정',
    description: '키워드 수정',
  })
  @ApiBody({ type: CreateKeywordDto })
  @Put('/keyword/:keywordId')
  키워드수정() {}

  @ApiOperation({
    summary: '키워드 삭제',
    description: '키워드 삭제',
  })
  @ApiBody({ type: CreateKeywordDto })
  @Put('/keyword/:keywordId')
  키워드삭제() {}

  @ApiOperation({
    summary: '해당 유저의 키워드 전체 조회',
    description: '해당 유저의 키워드 전체 조회',
  })
  @ApiResponse({ type: ResponseKeywordDto })
  @Get('')
  async findAllByUserId(@Req() req) {
    const userId = req.user.userId;

    const keywordData = await this.keywordService.findAllByUserId({ userId });
    // console.log(keywordData);
    return keywordData;
  }

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
