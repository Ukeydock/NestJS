import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class FindUserByUserIdDto extends PickType(UserDto, ['userId']) {}

export class CreateUserDto extends PickType(UserDto, ['nickname']) {}

export class UpdateUserDto {
  @ApiProperty({
    example: 'man || women',
    description: '성별',
  })
  gender?: string;

  @ApiProperty({
    example: '아직 정해야 함',
    description: '직업',
  })
  job?: string;

  @ApiProperty({
    example: '25',
    description: '나이',
  })
  age?: number;
}

export class UserListPageDto {
  @ApiProperty({
    example: 'man || women',
    description: '성별',
    required: false,
  })
  gender?: string;

  @ApiProperty({
    example: '아직 정해야 함',
    description: '직업',
    required: false,
  })
  job?: string;

  @ApiProperty({
    example: '25',
    description: '나이',
    required: false,
  })
  age?: number;

  @ApiProperty({
    example: '1',
    default: 1,
    description: '페이지',
    required: false,
  })
  page?: number;

  @ApiProperty({
    example: '10',
    default: 10,
    description: '한 페이지에 출력할 데이터 갯수',
    required: false,
  })
  limit?: number;
}
