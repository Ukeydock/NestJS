import { Keyword } from './database/entities/keyword.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdateUserDto {
  @ApiProperty({
    example: 'man || women',
    description: '성별',
  })
  gender?: string;

  @ApiProperty({
    example: '아직 정해야 함',
    description: '직업',
  })
  job?: string;

  @ApiProperty({
    example: '25',
    description: '나이',
  })
  age?: number;
}

export class RequestKeywordDto {
  @ApiProperty({
    example: 'keyword',
    description: '해당 키워드를 데이터베이스에 저장',
  })
  keyword: string;
}

export class ResponseKeywordDto {
  @ApiProperty({
    example: ['key1', 'key2', 'key3', '...총 10개'],
    description: '키워드 배열',
  })
  keyword: string[];
}

export class RequestUserListPageDto {
  @ApiProperty({
    example: 'man || women',
    description: '성별',
    required: false,
  })
  gender?: string;

  @ApiProperty({
    example: '아직 정해야 함',
    description: '직업',
    required: false,
  })
  job?: string;

  @ApiProperty({
    example: '25',
    description: '나이',
    required: false,
  })
  age?: number;

  @ApiProperty({
    example: '1',
    default: 1,
    description: '페이지',
    required: false,
  })
  page?: number;

  @ApiProperty({
    example: '10',
    default: 10,
    description: '한 페이지에 출력할 데이터 갯수',
    required: false,
  })
  limit?: number;
}

export class ResponseUserListPageDto {
  @ApiProperty({ example: ['마라탕', '떡볶이', '아이스 아메리카노'] })
  userKeyword: string[];

  @ApiProperty({ example: 'nickname' })
  userNickname: string;

  @ApiProperty({ example: '25' })
  userAge: string;

  @ApiProperty({ example: '디자이너' })
  userJob: string;

  @ApiProperty({ example: 1 })
  userId: number;
}

export class RequestVideoListPageDto {
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
  @ApiProperty({
    example: 'youtube | twitch | africa | ted',
    description: '해당 플랫폼의 영상 출력',
    default: 'youtube',
    required: false,
  })
  platform: string;
}

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
