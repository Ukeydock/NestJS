import { ApiProperty, PickType } from '@nestjs/swagger';
import { Keyword } from '@root/database/entities/keyword.entity';
import {
  IS_NUMBER_STRING,
  IsNumberString,
  isNumberString,
} from 'class-validator';

export class KeywordDto extends Keyword {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  keywordId: number;

  @ApiProperty()
  page?: number = 1;

  @ApiProperty()
  limit?: number = 10;

  recomendType: 'recent' | 'popular' | 'recommend';
}

export class FindKeywordByUserIdDto extends PickType(KeywordDto, ['userId']) {}

export class FindRecommendKeywordDto extends PickType(KeywordDto, [
  'recomendType',
  'limit',
]) {}
