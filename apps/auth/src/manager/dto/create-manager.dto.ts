import { IsIn } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateManagerDto extends CreateUserDto {
  @IsIn(['OPERATOR', 'AUDITOR', 'ADMIN'])
  userType: 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}
