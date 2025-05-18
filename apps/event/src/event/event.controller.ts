import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'apps/libs/common/decorators/current-user.decorator';
import { Roles } from 'apps/libs/common/decorators/user-roles.decorator';
import { JwtPayloadDto } from 'apps/libs/common/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'apps/libs/common/guards/auth.guard';
import { RolesGuard, UserRoles } from 'apps/libs/common/guards/roles.guard';
import { PagenationDto } from '../../../libs/common/dto/pagenation.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { EventService } from './event.service';

@ApiTags('이벤트')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // OPERATOR, ADMIN 권한 필요
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.OPERATOR, UserRoles.ADMIN)
  @Post('create')
  @ApiBearerAuth()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  // OPERATOR, ADMIN 권한 필요
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.OPERATOR, UserRoles.ADMIN)
  @Post('update/reward')
  @ApiBearerAuth()
  updateReward(@Body() updateRewardDto: UpdateRewardDto) {
    return this.eventService.updateReward(updateRewardDto);
  }

  // 권한 필요없음
  @Get('list')
  getEventList(@Query() pagenationDto: PagenationDto) {
    return this.eventService.getList(pagenationDto);
  }
  // 권한 필요없음
  @Get('detail/:id')
  getEventDetail(@Param() id: EventDetailDto) {
    return this.eventService.getDetail(id);
  }

  // 유저 이벤트 참여
  @Post('join')
  @Roles(UserRoles.USER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  joinEvent(
    @CurrentUser() payload: JwtPayloadDto,
    @Body() joinEventDto: EventDetailDto,
  ) {
    return this.eventService.joinEvent(payload, joinEventDto);
  }
}
