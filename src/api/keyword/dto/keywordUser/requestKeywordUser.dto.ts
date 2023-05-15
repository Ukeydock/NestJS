import { ApiProperty, PickType } from '@nestjs/swagger';
import { KeywordDto } from '../keyword.dto';

export class CreateUserKeywordDto extends PickType(KeywordDto, [
  `userId`,
  `keywordId`,
]) {}
