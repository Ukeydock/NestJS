import { ApiProperty } from '@nestjs/swagger';
import { Video } from '@root/database/entities/video.entity';
import { VideoDetail } from '@root/database/entities/videoDetail.entity';


export class VideoDto {
  duration: string;

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

  @ApiProperty({
    example: 'youtube | twitch | africa | ted',
    description: '해당 플랫폼의 영상 출력',
    default: 'youtube',
    required: false,
  })
  platform: string;

  @ApiProperty({
    example: {

    }
  })
  page ?: number = 1;

  @ApiProperty()
  limit ?: number = 16;






}

export class VideoDetailDto extends VideoDetail {}
