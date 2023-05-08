import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '@root/database/entities/auth.entity';
import { Repository } from 'typeorm';
import {
  CreateAuthDto,
  DeleteAuthByAuthIdDto,
  FindAuthByAuthIdDto,
  FindAuthByEmailDto,
} from './dto/requestAuth.dto';

export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async findOneById(findAuthByAuthIdDTO: FindAuthByAuthIdDto) {
    return await this.authRepository.findOne({
      where: { id: findAuthByAuthIdDTO.authId },
      relations: ['user'],
    });
  }

  async findOneByEmail(findAuthByEmailDto: FindAuthByEmailDto) {
    return await this.authRepository.findOne({
      where: { email: findAuthByEmailDto.email },
      relations: ['user'],
    });
  }

  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.insert({
      ...createAuthDto,
      user: { id: createAuthDto.userId },
    });
  }

  async deleteAuthByAuthId(deleteAuthByAuthIdDto: DeleteAuthByAuthIdDto) {
    await this.authRepository.delete(deleteAuthByAuthIdDto.authId);
  }
}
