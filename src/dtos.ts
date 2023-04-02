import { Keyword } from './database/entities/keyword.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RequestKeywordDto {
  @ApiProperty({
    example: 'keyword',
    description: '해당 키워드를 데이터베이스에 저장',
  })
  keyword: string;
}

export class ResponseKeywordDto {
  @ApiProperty({
    example: ['key1', 'key2', 'key3'],
    description: '키워드 배열',
  })
  keyword: string[];
}

export class RequestUserListPageDto {
  @ApiProperty({
    example: 'man || women',
    description: '성별',
  })
  gender: string;

  @ApiProperty({
    example: '아직 정해야 함',
    description: '직업',
  })
  job: string;

  @ApiProperty({
    example: '25',
    description: '나이',
  })
  age: number;
}

export class ResponseUserListPageDto {
  Keyword: string[];
  userNickname: string;
  userAge: string;
  userJob: string;
  userId: number;
}

export class RequestVideoListPageDto {
  @ApiProperty({
    example: '3600',
    description: '영상길이',
  })
  duration;
  @ApiProperty({
    example: '30',
    description: '현재 날짜에서 최근 30일 영상만 출력',
  })
  createDate;
  @ApiProperty({
    example: 'recent | view',
    description: '최신순 | 조회순',
  })
  order;
  @ApiProperty({
    example: 'youtube | twitch | africa | ted',
    description: '해당 플랫폼의 영상 출력',
  })
  platform;
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
