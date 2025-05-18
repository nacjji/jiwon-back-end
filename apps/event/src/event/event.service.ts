import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from 'apps/event/src/event/schema/event.schema';
import { JwtPayloadDto } from 'apps/libs/common/dto/jwt-payload.dto';
import { Model, Types } from 'mongoose';
import { PagenationDto } from '../../../libs/common/dto/pagenation.dto';
import { RewardService } from '../reward/reward.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { UserEvent } from './schema/user-event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly rewardService: RewardService,

    @InjectModel(UserEvent.name) private userEventModel: Model<UserEvent>,

    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  // 이벤트 생성
  async create(createEventDto: CreateEventDto) {
    const event = await this.eventModel.create({
      title: createEventDto.title,
      description: createEventDto.description,
      type: createEventDto.type,
      status: createEventDto.status,
      manualOrAutoReward: createEventDto.manualOrAutoReward,
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
    const event = await this.eventModel.findById(
      new Types.ObjectId(detailDto.id),
    );

    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }
    return event;
  }

  async updateReward(updateRewardDto: UpdateRewardDto) {
    const { id, reward } = updateRewardDto;

    const event = await this.eventModel.findById(new Types.ObjectId(id));

    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }

    const rewards = reward.map((reward) => ({
      ...reward,
      eventId: new Types.ObjectId(event._id),
      itemId: reward.itemId ? new Types.ObjectId(reward.itemId) : undefined,
    }));

    await this.rewardService.insertMany(rewards);

    return { event, rewards };
  }

  async joinEvent(payload: JwtPayloadDto, joinEventDto: EventDetailDto) {
    const event = await this.eventModel.findById(
      new Types.ObjectId(joinEventDto.id),
    );

    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }

    const userEvent = await this.userEventModel.findOne({
      userId: payload.userId,
      eventId: event._id,
    });

    if (userEvent) {
      throw new ConflictException('이미 참여한 이벤트입니다.');
    }

    await this.userEventModel.create({
      userId: payload.userId,
      eventId: event._id,
      title: event.title,
    });
  }
}
