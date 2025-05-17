import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'apps/libs/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'apps/libs/common/guards/auth.guard';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { UserService } from './user.service';

@ApiTags('회원관리')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findUser(@CurrentUser() user: JwtPayloadDto) {
    return user;
  }
}
