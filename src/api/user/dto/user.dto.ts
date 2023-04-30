import { ApiProperty } from '@nestjs/swagger';
import { User } from '@root/database/entities/user.entity';

export class UserDto extends User {
  @ApiProperty()
  userId: number;

  @ApiProperty({
    example: 'man || women',
    description: '성별',
  })
  gender: string;

  @ApiProperty({
    example: '아직 정해야 함',
    description: '직업',
  })
  job: string;

  @ApiProperty({
    example: '25',
    description: '나이',
  })
  age: Date;
}
