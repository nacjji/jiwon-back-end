import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: '유저 타입',
    example: 'USER',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  userType: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}
