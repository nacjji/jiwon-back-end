import { Body, Controller, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'apps/libs/common/decorators/current-user.decorator';
import { JwtPayloadDto } from 'apps/libs/common/dto/jwt-payload.dto';
import { PagenationDto } from '../../../libs/common/dto/pagenation.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { EventService } from './event.service';

@ApiTags('이벤트')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,

    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'hello_event' })
  helloEvent() {
    return this.authClient.send({ cmd: 'hello_auth' }, {});
  }

  // OPERATOR, ADMIN 권한 필요
  @MessagePattern({ cmd: 'create_event' })
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  // OPERATOR, ADMIN 권한 필요
  @MessagePattern({ cmd: 'update_reward' })
  updateReward(@Body() updateRewardDto: UpdateRewardDto) {
    return this.eventService.updateReward(updateRewardDto);
  }

  // 권한 필요없음
  @MessagePattern({ cmd: 'get_event_list' })
  getEventList(@Query() pagenationDto: PagenationDto) {
    return this.eventService.getList(pagenationDto);
  }
  // 권한 필요없음
  @MessagePattern({ cmd: 'get_event_detail' })
  getEventDetail(@Param() id: EventDetailDto) {
    return this.eventService.getDetail(id);
  }

  // 유저 이벤트 참여
  @MessagePattern({ cmd: 'join_event' })
  joinEvent(
    @CurrentUser() payload: JwtPayloadDto,
    @Body() joinEventDto: EventDetailDto,
  ) {
    return this.eventService.joinEvent(payload, joinEventDto);
  }
}
