import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '@root/database/entities/auth.entity';
import { Repository } from 'typeorm';
import {
  CreateAuthDto,

  FindAuthByEmailDto,
} from './dto/requestAuth.dto';

export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async findOneById(authId: number): Promise<Auth> {
    return await this.authRepository.findOne({
      where: { id: authId },
      relations: ['user'],
    });
  }

  async findOneByEmail(findAuthByEmailDto: FindAuthByEmailDto): Promise<Auth> {
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

  async deleteByAuthId(authId: number): Promise<void> {
    await this.authRepository.delete(authId);
  }
}
