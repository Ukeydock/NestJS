import { ApiProperty } from '@nestjs/swagger';
import { CommonRequestDto } from '@root/api/common/dto/request.dto';
import { User } from '@root/database/entities/user.entity';
import { IsDate, IsDateString, IsNumberString } from 'class-validator';

export class UserDto extends CommonRequestDto {
  @ApiProperty()
  @IsNumberString()
  userId?: number;

  @ApiProperty()
  nickname: string;

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

  @IsDateString()
  @ApiProperty({
    example: '1998-01-21',
    description: '나이',
  })
  birthday: Date;
}
