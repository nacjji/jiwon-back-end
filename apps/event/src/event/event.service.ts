import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from 'apps/event/src/event/schema/event.schema';
import { Model, Types } from 'mongoose';
import { RewardService } from '../reward/reward.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { PagenationDto } from './dto/pagenation.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly rewardService: RewardService,
  ) {}

  // 이벤트 생성
  async create(createEventDto: CreateEventDto) {
    const event = await this.eventModel.create({
      title: createEventDto.title,
      description: createEventDto.description,
      type: createEventDto.type,
      status: createEventDto.status,
      startDate: createEventDto.startDate,
      endDate: createEventDto.endDate,
      conditions: createEventDto.conditions,
    });

    const rewards = createEventDto.rewards.map((reward) => ({
      ...reward,
      eventId: new Types.ObjectId(event._id),
      itemId: reward.itemId ? new Types.ObjectId(reward.itemId) : undefined,
    }));

    await this.rewardService.insertMany(rewards);

    return { event, rewards };
  }

  // 이벤트 리스트 조회
  async getList(pagenationDto: PagenationDto) {
    const { page, limit, search } = pagenationDto;

    const query = {};

    if (search) {
      query['title'] = { $regex: search, $options: 'i' };
    }

    const events = await this.eventModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.eventModel.countDocuments(query);

    return {
      events,
      total,
      page,
      limit,
    };
  }

  // 상세
  async getDetail(detailDto: EventDetailDto) {
    const { id } = detailDto;
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }
    return event;
  }
}
