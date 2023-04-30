import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '@root/database/entities/auth.entity';
import { Repository } from 'typeorm';
import {
  CreateAuthDto,
  FindAuthByAuthIdDto,
  FindAuthByEmailDto,
} from './dto/requestAuth.dto';

export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async findOneById(findAuthByAuthIdDTO: FindAuthByAuthIdDto) {
    return await this.authRepository.findOneBy({
      id: findAuthByAuthIdDTO.authId,
    });
  }

  async findOneByEmail(findAuthByEmailDto: FindAuthByEmailDto) {
    return await this.authRepository.findOneBy({
      email: findAuthByEmailDto.email,
    });
  }

  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.insert({
      ...createAuthDto,
      user: { id: createAuthDto.userId },
    });
  }
}
