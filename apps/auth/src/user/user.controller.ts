import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'apps/libs/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'apps/libs/common/guards/auth.guard';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  async getUser(@CurrentUser() user: JwtPayloadDto) {
    return user;
  }
}
