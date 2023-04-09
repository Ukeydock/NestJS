import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/requestComment.dto';
import { UpdateCommentDto } from './dto/responseComment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { commentApiOperationDescription } from '@root/admin.api/document/comment.document';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    summary: '댓글 작성',
    description: commentApiOperationDescription.createComment,
  })
  @Post('/:postId')
  댓글작성() {}

  @ApiOperation({
    summary: '댓글 수정',
    description: commentApiOperationDescription.updateComment,
  })
  @Put('/:postId')
  댓글수정() {}

  @ApiOperation({
    summary: '댓글 삭제',
    description: commentApiOperationDescription.deleteComment,
  })
  @Delete('/:postId')
  댓글삭제() {}
}
