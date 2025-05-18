import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CurrentUser } from 'apps/libs/common/decorators/current-user.decorator';
import { Roles } from 'apps/libs/common/decorators/user-roles.decorator';
import { JwtPayloadDto } from 'apps/libs/common/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'apps/libs/common/guards/auth.guard';
import { RolesGuard, UserRoles } from 'apps/libs/common/guards/roles.guard';
import { RequestRewardDto } from './dto/request-reward.dto';
import { RewardListDto } from './dto/reward-list.dto';
import { RewardService } from './reward.service';

@Controller('Reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  // 유저 보상 요청
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  @Post('request')
  @ApiBearerAuth()
  async requestReward(
    @CurrentUser() payload: JwtPayloadDto,
    @Body() requestRewardDto: RequestRewardDto,
  ) {
    return this.rewardService.requestReward(payload, requestRewardDto);
  }

  // 유저 보상 요청 내역 ADMIN & OPERATOR & AUDITOR
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.OPERATOR, UserRoles.AUDITOR)
  @Get('list')
  @ApiBearerAuth()
  async getUserRewardList(@Query() query: RewardListDto) {
    return this.rewardService.getUserRewardList(query);
  }
}
