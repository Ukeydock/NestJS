import {
  CreateUserDto,
  FindAllByGenderAndAgeDto,
  FindUserByUserIdDto,
  FindUserListPageDto,
} from '../dto/requestUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';
import { Repository } from 'typeorm';
import {
  FindOneUser,
  FindUserListQuery,
  FindUserSubscribedKeywordListQuery,
} from './userListQueryBuilder';
import { FindOneUserDto } from '../dto/responseUser.dto';

export class UserRepositoyry {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // 유저 아이디로 유저 정보 조회
  async findOneById(userId: number): Promise<FindOneUserDto> {
    // console.log(findUserByUserIdDto)
    const findOneByIdQuery = new FindOneUser( this.userRepository,userId);
    return await findOneByIdQuery.getRawOne()
  }

  /**
   * 
   * @param findAllByGenderAndAgeDto 
   * @returns 
   * 
   */
  async findAllByGenderAndAge(findAllByGenderAndAgeDto: FindAllByGenderAndAgeDto): Promise<{ userId: number }[]> {
    // 매개변수로 온 Date에서 10년전과 10년 후의 Date 조건을 만들어준다.
    const startDate = new Date(new Date(findAllByGenderAndAgeDto.birthday).getFullYear() - 10, new Date(findAllByGenderAndAgeDto.birthday).getMonth(), new Date(findAllByGenderAndAgeDto.birthday).getDate());
    const endDate = new Date(new Date(findAllByGenderAndAgeDto.birthday).getFullYear() + 10, new Date(findAllByGenderAndAgeDto.birthday).getMonth(), new Date(findAllByGenderAndAgeDto.birthday).getDate());

    // 해당 성별의 유저를 조회하고, 나이가 위아래로 10살 이내인 유저를 조회한다.
    const findOneByGenderAndAgeQuery = this.userRepository.createQueryBuilder(`U01`).select([
      `U01.id AS userId`,
    ]).limit(findAllByGenderAndAgeDto.limit)
      .where(`U01.gender =  :gender`, { gender: findAllByGenderAndAgeDto.gender })
      .andWhere('U01.birthday >= :startDate', { startDate })
      .andWhere('U01.birthday <= :endDate', { endDate })
      .orderBy('RAND()')

    return await findOneByGenderAndAgeQuery.getRawMany()

  }

  // 해당 키워드를 구독한 유저의 목록
  async findAllUserSubscribedKeywordList(
    findUserListPageDto: FindUserListPageDto,
    keywordId: number,
  ) {
    const findUserSubscribedKeywordListQuery =
      new FindUserSubscribedKeywordListQuery(
        findUserListPageDto,
        this.userRepository,
        keywordId,
      );

    return await findUserSubscribedKeywordListQuery.getQuery.getRawMany();
  }

  // 유저의 목록
  async findAll(findUserListPageDto: FindUserListPageDto): Promise<FindOneUserDto[]> {
    const findUserQuery = new FindUserListQuery(
      findUserListPageDto,
      this.userRepository,
    );

    return await findUserQuery.getQuery.getRawMany();
  }

  // 유저 생성
  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.insert({ ...createUserDto });
  }

  // 유저 정보 수정
  async updateById(userId: number, updateUserDto) {
    await this.userRepository.update({ id: userId }, { ...updateUserDto });
  }
}
