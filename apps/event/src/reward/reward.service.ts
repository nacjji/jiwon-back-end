import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayloadDto } from 'apps/libs/common/dto/jwt-payload.dto';
import { ClientSession, Model, Types } from 'mongoose';
import { Event, ManualOrAuto } from '../event/schema/event.schema';
import { UserEvent } from '../event/schema/user-event.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RequestRewardDto } from './dto/request-reward.dto';
import { RewardListDto } from './dto/reward-list.dto';
import { Reward } from './schema/reward.schema';
import { UserReward, UserRewardStatus } from './schema/user-reward.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(UserReward.name) private userRewardModel: Model<UserReward>,
    @InjectModel(UserEvent.name) private userEventModel: Model<UserEvent>,
  ) {}

  async create(createRewardDto: CreateRewardDto) {
    const reward = await this.rewardModel.create(createRewardDto);
    return reward;
  }

  async insertMany(
    createRewardDto: CreateRewardDto[],
    session?: ClientSession,
  ) {
    const rewards = await this.rewardModel.insertMany(createRewardDto, {
      session,
    });
    return rewards;
  }

  async requestReward(
    payload: JwtPayloadDto,
    requestRewardDto: RequestRewardDto,
  ) {
    const event = await this.eventModel.findById(
      new Types.ObjectId(requestRewardDto.eventId),
    );

    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }
    const userEvent = await this.userEventModel.findOne({
      userId: payload.userId,
      eventId: event._id,
    });

    const userReward = await this.userRewardModel.findOne({
      userId: payload.userId,
      eventId: event._id,
    });

    if (userEvent.completedAt === null) {
      throw new ConflictException('이벤트 완료 상태가 아닙니다.');
    }

    if (userReward) {
      throw new ConflictException('이미 보상 요청이 완료되었습니다.');
    }

    if (event.manualOrAutoReward === ManualOrAuto.AUTO) {
      const userReward = await this.userRewardModel.create({
        userId: payload.userId,
        eventId: event._id,
        status: UserRewardStatus.REWARDED,
      });

      return userReward;
    } else if (event.manualOrAutoReward === ManualOrAuto.MANUAL) {
      const userReward = await this.userRewardModel.create({
        userId: payload.userId,
        eventId: event._id,
        status: UserRewardStatus.REQUESTED,
      });

      return userReward;
    }
  }

  async getUserRewardList(rewardListDto: RewardListDto) {
    const { page, limit, rewardStatus, search } = rewardListDto;

    const query = {};

    if (search) {
      query['userId'] = { $regex: search, $options: 'i' };
    }

    if (rewardStatus) {
      query['status'] = rewardStatus;
    }

    const userRewards = await this.userRewardModel
      .find(query)
      .populate({
        path: 'eventId',
        select: 'title, status',
        model: Event.name,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.userRewardModel.countDocuments(query);

    return {
      userRewards,
      total,
      page,
      limit,
    };
  }
}
