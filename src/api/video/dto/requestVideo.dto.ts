import { ApiProperty, PickType } from '@nestjs/swagger';
import { VideoDto } from './video/video.dto';

export class VideoPageDto extends PickType(VideoDto, [
  'duration',
  'createdAgo',
  'order',
  'platform',
]) {}

export class FindAllViewVidoDto {

  @ApiProperty({})
  keywordId : number;

  @ApiProperty({})
  order : 'ASC' | 'DESC';

  @ApiProperty({})
  sort : `date`|`view`|`comment`;

  @ApiProperty({})
  page ?: number = 1;

  @ApiProperty({})
  limit ?: number = 16;

}

export class VideoDetailPageDto {
  @ApiProperty({
    example: 'youtube | twitch | africa | ted',
    description: '해당 플랫폼의 영상 출력',
  })
  platform;
}

export class MovieListPageDto {
  @ApiProperty({
    example: '3600',
    default: '7200',
    description: '영상길이(초단위)',
    required: false,
  })
  duration?: string;
  @ApiProperty({
    example: '30',
    default: 'none',
    description: '현재 날짜에서 최근 createdAgo일 영상만 출력',
    required: false,
  })
  createdAgo?: string;
  @ApiProperty({
    example: 'recent | view',
    default: 'recent',
    description: '최신순 | 조회순',
    required: false,
  })
  order?: string;
}
