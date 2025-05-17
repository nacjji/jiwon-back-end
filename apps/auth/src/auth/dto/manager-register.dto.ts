import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { RegisterDto } from './register.dto';

export class ManagerRegisterDto extends RegisterDto {
  @ApiProperty({
    description: '유저 타입',
    example: 'OPERATOR',
    required: true,
  })
  @IsIn(['OPERATOR', 'AUDITOR', 'ADMIN'])
  userType: 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}
