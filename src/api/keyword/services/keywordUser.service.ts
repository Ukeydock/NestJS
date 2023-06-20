import {
  CreateUserKeywordDto,
  DeleteByUserIdAndKeywordIdDto,
  UpdateMainKeyworDto,
} from '../dto/keywordUser/requestKeywordUser.dto';
import { KeywordUserRepository } from '../repositories/keywordUser.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeywordUserService {
  constructor(private readonly keywordUserRepository: KeywordUserRepository) {}

  async findByUserIdAndKeywordId(userId: number, keywordId: number) {
    return await this.keywordUserRepository.findByUserIdAndKeywordId(
      userId,
      keywordId,
    );
  }

  async create(createUserKeywordDto: CreateUserKeywordDto) {
    return await this.keywordUserRepository.create(createUserKeywordDto);
  }

  async updateMainKeyword(updateMainKeyworDto: UpdateMainKeyworDto) {
    await this.keywordUserRepository.updateAllIsMainToFalse(
      updateMainKeyworDto,
    );
    return await this.keywordUserRepository.updateMainKeyword(
      updateMainKeyworDto,
    );
  }

  async deleteByUserIdAndKeywordId(
    deleteByUserIdAndKeywordIdDto: DeleteByUserIdAndKeywordIdDto,
  ) {
    return await this.keywordUserRepository.deleteByUserIdAndKeywordId(
      deleteByUserIdAndKeywordIdDto,
    );
  }
}
