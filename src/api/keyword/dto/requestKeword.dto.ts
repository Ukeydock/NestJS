import { ApiProperty, PickType } from '@nestjs/swagger';
import { KeywordDto } from './keyword.dto';

export class CreateKeywordDto extends PickType(KeywordDto, ['keyword']) {}

export class FindAllKeywordDto extends PickType(KeywordDto, [
  'keyword',
  `userId`,
  `page`,
  `limit`,
]) {}
