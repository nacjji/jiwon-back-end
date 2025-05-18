import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from 'apps/event/src/event/dto/create-event.dto';
import { EventDetailDto } from 'apps/event/src/event/dto/event-detail.dto';
import { UpdateRewardDto } from 'apps/event/src/event/dto/update-reward.dto';
import { CurrentUser } from 'apps/libs/common/decorators/current-user.decorator';
import { Roles } from 'apps/libs/common/decorators/user-roles.decorator';
import { JwtPayloadDto } from 'apps/libs/common/dto/jwt-payload.dto';
import { PagenationDto } from 'apps/libs/common/dto/pagenation.dto';
import { JwtAuthGuard } from 'apps/libs/common/guards/auth.guard';
import { RolesGuard, UserRoles } from 'apps/libs/common/guards/roles.guard';

@ApiTags('이벤트')
@Controller('event')
export class EventController {
  constructor(
    @Inject('EVENT_SERVICE')
    private readonly eventClient: ClientProxy,
  ) {}

  @Get('hello')
  hello() {
    return this.eventClient.send({ cmd: 'hello_event' }, {});
  }

  // OPERATOR, ADMIN 권한 필요
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.OPERATOR, UserRoles.ADMIN)
  @Post('create')
  @ApiBearerAuth()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventClient.send({ cmd: 'create_event' }, createEventDto);
  }

  // OPERATOR, ADMIN 권한 필요
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.OPERATOR, UserRoles.ADMIN)
  @Post('update/reward')
  @ApiBearerAuth()
  updateReward(@Body() updateRewardDto: UpdateRewardDto) {
    return this.eventClient.send({ cmd: 'update_reward' }, updateRewardDto);
  }

  // 권한 필요없음
  @Get('list')
  getEventList(@Query() pagenationDto: PagenationDto) {
    return this.eventClient.send({ cmd: 'get_event_list' }, pagenationDto);
  }
  // 권한 필요없음
  @Get('detail/:id')
  getEventDetail(@Param() id: EventDetailDto) {
    return this.eventClient.send({ cmd: 'get_event_detail' }, id);
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
    return this.eventClient.send(
      { cmd: 'join_event' },
      { payload, joinEventDto },
    );
  }
}
