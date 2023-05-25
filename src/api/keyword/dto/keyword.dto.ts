import { ApiProperty, PickType } from '@nestjs/swagger';
import { Keyword } from '@root/database/entities/keyword.entity';

export class KeywordDto extends Keyword {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  keywordId: number;

  @ApiProperty()
  page?: number = 1;

  @ApiProperty()
  limit?: number = 10;
}

export class FindKeywordByUserIdDto extends PickType(KeywordDto, ['userId']) {}
