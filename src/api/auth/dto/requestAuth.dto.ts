import { PickType } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';

export class RequestAuthDto extends AuthDto {
  constructor() {
    super();
  }
}

export class FindAuthByAuthIdDto extends PickType(RequestAuthDto, ['authId']) {}

export class FindAuthByEmailDto extends PickType(RequestAuthDto, ['email']) {}

export class DeleteAuthByAuthIdDto extends PickType(RequestAuthDto, [
  'authId',
]) {}

export class CreateAuthDto extends PickType(RequestAuthDto, [
  'snsId',
  'email',
  'platform',
  'userId',
]) {}
