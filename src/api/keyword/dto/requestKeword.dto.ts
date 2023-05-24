import { ApiProperty, PickType } from '@nestjs/swagger';
import { KeywordDto } from './keyword.dto';

export class CreateKeywordDto {
  @ApiProperty({
    example: 'keyword',
    description: '해당 키워드를 데이터베이스에 저장',
  })
  keyword: string;
}

export class findAllKeywordDto extends PickType(KeywordDto, ['keyword']) {}
