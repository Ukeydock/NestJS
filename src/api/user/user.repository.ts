import { CreateUserDto, FindUserByUserIdDto } from './dto/requestUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';
import { Repository } from 'typeorm';

export class UserRepositoyry {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(findUserByUserIdDto: FindUserByUserIdDto) {
    return await this.userRepository.findBy({ id: findUserByUserIdDto.userId });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.insert({ ...createUserDto });
  }

  async updateById(userId, updateUserObject) {
    await this.userRepository.update({ id: userId }, { ...updateUserObject });
  }
}
