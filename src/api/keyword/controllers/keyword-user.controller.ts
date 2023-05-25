import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { KeywordUserService } from '../services/keywordUser.service';
import { FindOneByUserIdAndKeywordIdDto } from '../dto/keywordUser/requestKeywordUser.dto';
import { JwtAuthGuard } from '@root/api/auth/jwt/jwt.guard';

@Controller('keyword-user')
@UseGuards(JwtAuthGuard)
export class KeywordUserController {
  constructor(private readonly keywordUserService: KeywordUserService) {}

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
}
