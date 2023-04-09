import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './requestComment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
