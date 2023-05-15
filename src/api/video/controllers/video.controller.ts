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
} from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { VideoPageDto } from '../dto/requestVideo.dto';
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
  constructor(private readonly videoService: VideoService) {}

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
    const videoData = await this.videoService.findVideoListByPlatform(
      param.keyword,
      videoPageDto,
    );
    return { videoData };
  }

  // @ApiOperation({
  //   summary: '비디오 상세 페이지',
  //   description: '비디오 상세 페이지',
  // })
  // @ApiBody({ type: RequestVideoDetailPageDto })
  // @ApiResponse({ type: ResponseVideoDetailPageDto })
  // @Get('/video/:videoUniqueId')
  // 비디오상세페이지조회() {}
}
