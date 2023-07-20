import { ApiProperty, PickType } from '@nestjs/swagger';
import { KeywordDto } from '../keyword.dto';

export class CreateUserKeywordDto extends PickType(KeywordDto, [
  `userId`,
  `keywordId`,
]) {}

export class FindOneByUserIdAndKeywordIdDto extends PickType(KeywordDto, [
  `keywordId`,
]) {}

export class UpdateMainKeyworDto extends PickType(KeywordDto, [
  `userId`,
  `keywordId`,
  ]) {}

export class DeleteByUserIdAndKeywordIdDto extends PickType(KeywordDto, [
  `userId`,
  `keywordId`,
]) {}
