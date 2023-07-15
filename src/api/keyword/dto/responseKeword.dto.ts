import { ApiProperty } from '@nestjs/swagger';

export class ResponseKeywordDto {
  @ApiProperty({
    example: 'key1',
    description: '키워드 배열',
  })
  keyword: string;

  @ApiProperty({
    example: 1,
    description: '키워드의 count',
  })
  count: number;

  @ApiProperty({
    example: 1,
    description: '키워드의 id',
  })
  keywordId: number;

  @ApiProperty({
    example: '2021-01-01',
    description: '키워드 생성 날짜',
  })
  createdAt: string;
}
