import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { PagenationDto } from './dto/pagenation.dto';
import { EventService } from './event.service';

@ApiTags('이벤트')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // OPERATOR, ADMIN 권한 필요
  @Post('create')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  // 권한 필요없음
  @Get('list')
  getEventList(@Query() pagenationDto: PagenationDto) {
    return this.eventService.getList(pagenationDto);
  }

  @Get('detail/:id')
  getEventDetail(@Param() detailDto: EventDetailDto) {
    return this.eventService.getDetail(detailDto);
  }
}
