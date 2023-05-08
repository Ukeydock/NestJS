import { ApiProperty } from '@nestjs/swagger';
import { Auth } from '@root/database/entities/auth.entity';

export class AuthDto extends Auth {
  @ApiProperty()
  authId: number;

  @ApiProperty()
  snsId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  platform: string;

  @ApiProperty()
  userId: number;
}
