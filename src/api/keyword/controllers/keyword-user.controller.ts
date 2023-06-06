import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KeywordUserService } from '../services/keywordUser.service';
import {
  CreateUserKeywordDto,
  FindOneByUserIdAndKeywordIdDto,
} from '../dto/keywordUser/requestKeywordUser.dto';
import { JwtAuthGuard } from '@root/api/auth/jwt/jwt.guard';

@Controller('keyword-user')
@UseGuards(JwtAuthGuard)
export class KeywordUserController {
  constructor(private readonly keywordUserService: KeywordUserService) { }

  @Get('/[@]:keywordId')
  async findOneByUserIdAndKeywordId(
    @Param() params: FindOneByUserIdAndKeywordIdDto,
    @Req() req,
  ) {
    const { userId } = req.user;
    const { keywordId } = params;
    const keywordUserData =
      await this.keywordUserService.findByUserIdAndKeywordId(userId, keywordId);
    return keywordUserData;
  }

  // 키워드 추가
  @Post(`/:keywordId`)
  async create(@Param(`keywordId`, ParseIntPipe) param: number, @Req() req) {
    const { userId } = req.user;

    await this.keywordUserService.create({
      userId,
      keywordId: param,
    });
    return { message: '키워드 추가 성공!' };
  }

  @Delete(`/[@]:keywordId`)
  async deleteByUserIdAndKeywordId(
    @Param() param: { keywordId: number },
    @Req() req,
  ) {
    const { userId } = req.user;

    await this.keywordUserService.deleteByUserIdAndKeywordId({
      userId,
      keywordId: param.keywordId,
    });
  }
}
