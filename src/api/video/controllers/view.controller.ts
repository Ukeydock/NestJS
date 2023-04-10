import { Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestVideoListPageDto } from '../dto/requestVideo.dto';
import { ResponseVideoListPageDto } from '../dto/responseVideo.dto';

@ApiTags('View')
@Controller('view')
@UseGuards()
export class ViewController {
  constructor() {}

  @ApiOperation({
    summary: '유저가 조회한 비디오 기록 조회',
    description: '페이지네이션',
  })
  @ApiQuery({
    type: RequestVideoListPageDto,
  })
  @ApiResponse({ type: ResponseVideoListPageDto })
  @Post('/:videoUniqueId')
  조회기록조회() {}

  @ApiOperation({
    summary: '유저 조회기록 저장',
    description: '비디오 리스팅 페이지',
  })
  @Post('/:videoUniqueId')
  조회기록저장() {}

  @ApiOperation({
    summary: '유저 조회기록 전체 삭제',
    description:
      '해당 유저의 조회기록을 모두 삭제합니다. 조회기록은 키워드 추천 알고리즘 등에 사용될 수 있으므로 주의사항을 알려주고 삭제시키기!',
  })
  @Delete('/all')
  조회기록전체삭제() {}
}
