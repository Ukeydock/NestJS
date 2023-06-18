import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseVideoListPageDto } from '../dto/responseVideo.dto';
import { VideoUserService } from '../services/videoUserView.service';
import { JwtAuthGuard } from '@root/api/auth/jwt/jwt.guard';

@ApiTags('View')
@Controller('view')
@UseGuards(JwtAuthGuard)
export class VideoUserController {
  constructor(

    private readonly videoUserService: VideoUserService
  ) { }



  @ApiOperation({
    summary: '유저가 조회한 비디오 기록 조회',
    description: '페이지네이션',
  })
  @ApiQuery({})
  @ApiResponse({ type: ResponseVideoListPageDto })
  @Get('/:videoUniqueId')
  조회기록조회() { }

  @ApiOperation({
    summary: '유저 조회기록 저장',
    description: '비디오 리스팅 페이지',
  })
  @Post('/[@]:videoDbId')
  create(@Req() req, @Param() param: { videoDbId: number }) {
    const { userId } = req.user;


    this.videoUserService.updateIsRecentlyByVideoId(param.videoDbId)
    this.videoUserService.create({ userId, videoDbId: param.videoDbId });
  }

  @ApiOperation({
    summary: '유저 조회기록 전체 삭제',
    description:
      '해당 유저의 조회기록을 모두 삭제합니다. 조회기록은 키워드 추천 알고리즘 등에 사용될 수 있으므로 주의사항을 알려주고 삭제시키기!',
  })
  @Delete('/all')
  조회기록전체삭제() { }
}
