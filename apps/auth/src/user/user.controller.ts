import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'apps/libs/common/decorators/current-user.decorator';
import { Roles } from 'apps/libs/common/decorators/user-roles.decorator';
import { JwtAuthGuard } from 'apps/libs/common/guards/auth.guard';
import { RolesGuard, UserRoles } from 'apps/libs/common/guards/roles.guard';
import { JwtPayloadDto } from '../../../libs/common/dto/jwt-payload.dto';
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get('user/admin')
  async adminOnly(@CurrentUser() user: JwtPayloadDto) {
    return user;
  }
}
