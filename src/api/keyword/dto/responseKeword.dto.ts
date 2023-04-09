import { ApiProperty } from '@nestjs/swagger';

export class ResponseKeywordDto {
  @ApiProperty({
    example: ['key1', 'key2', 'key3', '...총 10개'],
    description: '키워드 배열',
  })
  keyword: string[];
}
