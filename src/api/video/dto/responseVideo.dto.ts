import { ApiProperty } from '@nestjs/swagger';

export class ResponseVideoListPageDto {
  @ApiProperty({
    example: 'dvnhes23',
    description: '해당 비디오의 아이디',
  })
  videoUniqueId: string;

  @ApiProperty({
    example: '이미지 사진 경로',
    description: '비디오 썸네일',
  })
  videoThubnail: string;

  @ApiProperty({
    example: 'Video Title',
    description: '비디오 타이틀',
  })
  videoTitle: string;

  @ApiProperty({
    example: 'n일전',
    description: '해당 영상의 생성 일자',
  })
  videoCreatedDate;

  @ApiProperty({
    example: '비디오 제작자 이름',
    description: '비디오 제작자 이름',
  })
  videoAuthorName: string;

  @ApiProperty({
    example: '비디오 제작자 프로필 사진',
    description: '비디오 제작자 프로필 사진',
  })
  videoAuthorThumbnail: string;

  @ApiProperty({
    example: '30:00',
    description: '비디오의 길이',
  })
  videoDuration: string;
}

export class RespoeVideoListPageDto {
  @ApiProperty({
    example: 'dvnhes23',
    description: '해당 비디오의 아이디',
  })
  videoUniqueId: string;
}

export class ResponseVideoDetailPageDto {
  @ApiProperty({
    example: '비디오 경로', // 유투브는 비디오 아이디만 있으면 되지만 플랫폼 별로 영상 URL이 어떻게 될지 아직 몰라서 일단 보내는 주는 거로..
    description: '비디오 경로',
  })
  videoPath: string;

  @ApiProperty({
    example: 'Video Title',
    description: '비디오 타이틀',
  })
  videoTitle: string;

  @ApiProperty({
    example: 'Description',
    description: '해당 비디오에 대한 설명',
  })
  videoDescription: string;

  @ApiProperty({
    example: '이미지 사진 경로',
    description: '비디오 썸네일',
  })
  videoThubnail: string;

  @ApiProperty({
    example: 'n일전',
    description: '해당 영상의 생성 일자',
  })
  videoCreatedDate;

  @ApiProperty({
    example: '비디오 제작자 이름',
    description: '비디오 제작자 이름',
  })
  videoAuthorName: string;

  @ApiProperty({
    example: '비디오 제작자 프로필 사진',
    description: '비디오 제작자 프로필 사진',
  })
  videoAuthorThumbnail: string;

  @ApiProperty({
    example: '30:00',
    description: '비디오의 길이',
  })
  videoDuration: string;

  @ApiProperty({
    example: 'true | false',
    description: '즐겨찾기 유무',
  })
  videoBookmark: Boolean;

  @ApiProperty({
    example: '1',
    description: '비디오 조회수',
  })
  videoViews: Number;
}
