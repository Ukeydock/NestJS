import { PickType } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';

export class RequestAuthDto extends AuthDto {
  constructor() {
    super();
  }
}


export class FindAuthByEmailDto extends PickType(RequestAuthDto, ['email']) {}



export class CreateAuthDto extends PickType(RequestAuthDto, [
  'snsId',
  'email',
  'platform',
  'userId',
]) {}
