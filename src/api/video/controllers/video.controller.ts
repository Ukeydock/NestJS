import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { FindAllViewVidoDto, VideoPageDto } from '../dto/requestVideo.dto';
import {
  ResponseVideoDetailPageDto,
  ResponseVideoListPageDto,
} from '../dto/responseVideo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtStrategy } from '@root/api/auth/jwt/jwt.strategy';
import { JwtAuthGuard } from '@root/api/auth/jwt/jwt.guard';

@ApiTags('Video')
@Controller('video')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @ApiOperation({
    summary: '비디오 상세 페이지',
    description: '비디오 상세 페이지',
  })
  @Get(`/[@]:videoDbId`)
  async findVideoDetail(@Param() param: { videoDbId: number }) {
    const videoDetailData = await this.videoService.findOneByVideoDbId(
      param.videoDbId,
    );
    return videoDetailData;
  }

  @ApiOperation({
    summary: '비디오 리스팅 페이지',
    description: '비디오 리스팅 페이지',
  })
  @ApiQuery({ type: VideoPageDto })
  @ApiResponse({ type: ResponseVideoListPageDto })
  @Get('/:keyword')
  async findVideoList(
    @Param() param: { keyword: string },
    @Query() videoPageDto: VideoPageDto,
  ) {
    const videoData = await this.videoService.findByKeyword(param);
    return { videoData };
  }

  @ApiOperation({
    summary: '해당 유저가 조회한 비디오 리스팅',
    description: 'userVideoView 테이블에에 Join',
  })
  @ApiQuery({ type: FindAllViewVidoDto })
  @ApiResponse({ type: ResponseVideoListPageDto })
  @Get('/view/[@]:userId')
  async findViewVideoByUserId(
    @Req() req,
    @Param() param: { userId: number },
    @Query() query: FindAllViewVidoDto,
  ) {
    const userId = param.userId == 0 ? req.user.userId : param.userId;

    const videoData = await this.videoService.findViewVideoByUserId(userId, query);
    return { videoData };
  }
  


}
