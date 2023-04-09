import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VideoService } from '../services/video.service';
import {
  RequestMovieListPageDto,
  RequestVideoDetailPageDto,
  RequestVideoListPageDto,
} from '../dto/requestVideo.dto';
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

@ApiTags('Video')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

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
}
