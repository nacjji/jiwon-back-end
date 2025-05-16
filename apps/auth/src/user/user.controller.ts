import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('회원관리')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
