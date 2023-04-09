import { ApiProperty } from '@nestjs/swagger';

export class RequestKeywordDto {
  @ApiProperty({
    example: 'keyword',
    description: '해당 키워드를 데이터베이스에 저장',
  })
  keyword: string;
}
