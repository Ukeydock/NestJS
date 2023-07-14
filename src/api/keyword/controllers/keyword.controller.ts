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
  Query,
} from '@nestjs/common';
import { KeywordService } from '../services/keyword.service';
import { CreateKeywordDto, FindAllKeywordDto } from '../dto/requestKeword.dto';
import { ResponseKeywordDto } from '../dto/responseKeword.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { KeywordUserService } from '../services/keywordUser.service';
import axios from 'axios';
import { FindRecommentKeywordDto } from '../dto/keyword.dto';

@ApiTags('Keyword')
@Controller('keyword')
@UseGuards(JwtAuthGuard)
export class KeywordController {
  constructor(
    private readonly keywordService: KeywordService,
    private readonly keywordUserService: KeywordUserService,
  ) {}

  @ApiOperation({
    summary: '키워드 조회. (검색, 필터 허용)(완)',
    description: '유저가 검색창에 키워드를 입력하면 ',
  })
  @ApiResponse({ type: ResponseKeywordDto })
  @Get('/search')
  async findAll(@Query() query: FindAllKeywordDto, @Req() req) {
    const {userId} = req.user
    const keywordData = await this.keywordService.findAll(userId,query);
    return keywordData;
  }

  @ApiOperation({
    summary: '해당 유저의 키워드 전체 조회(완)',
    description: '해당 유저의 키워드 전체 조회, 0번이 유저아이디로 오면 로그인한 유저의 아이디로 변경',
  })
  @ApiResponse({ type: ResponseKeywordDto })
  @Get('/[@]:userId')
  async findAllByUserId(@Req() req, @Param() param: { userId: number }) {
    // 0번 유저아이디가 오면 로그인한 유저의 아이디로 변경
    const userId = param.userId == 0 ? req.user.userId : param.userId;
    const keywordData = await this.keywordService.findAllByUserId({ userId });
    // console.log(keywordData);
    return keywordData;
  }

  @ApiOperation({
    summary: '키워드의 count와 다른 알고리즘을 이용해 추천 키워드(완) ',
    description: '키워드의 count와 다른 알고리즘을 이용해 추천 키워드',
  })
  @ApiResponse({ type: ResponseKeywordDto })
  @Get('/recommend')
  async finsAllRecomendedKeyword(
    @Req() req,
    @Query() query: FindRecommentKeywordDto,
  ) {
    const userId = req.user.userId;
    const recomendKeywordData =
      await this.keywordService.findAllRecomendedKeyword(
         userId,
        {
       
        recomendType: query.recomendType,
        limit: query.limit,
      });
    return recomendKeywordData;
  }





}
