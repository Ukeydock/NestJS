import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {} from '../dto/requestVideo.dto';
import { ResponseVideoListPageDto } from '../dto/responseVideo.dto';
import { Controller, Get } from '@nestjs/common';
import { ResponseKeywordDto } from '@root/api/keyword/dto/responseKeword.dto';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  @ApiOperation({
    summary: '영화 리스팅 페이지',
    description: `영화 리스팅 페이지 
     `,
  })
  @ApiQuery({})
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
