import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserListPageDto {
  @ApiProperty({ example: ['마라탕', '떡볶이', '아이스 아메리카노'] })
  userKeyword: string[];

  @ApiProperty({ example: 'nickname' })
  userNickname: string;

  @ApiProperty({ example: '25' })
  userAge: string;

  @ApiProperty({ example: '디자이너' })
  userJob: string;

  @ApiProperty({ example: 1 })
  userId: number;
}

export class FindOneUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userNickname: string;

  @ApiProperty()
  userGender: string;

  @ApiProperty()
  userJob: string;

  @ApiProperty()
  userCreatedAt: Date;

  @ApiProperty()
  userUpdatedAt: Date;

  @ApiProperty()
  userProfileImage: string;

  @ApiProperty()
  userAge: string;

  @ApiProperty()
  userBirthday: Date;
}