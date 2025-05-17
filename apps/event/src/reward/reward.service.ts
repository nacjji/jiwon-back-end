import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Reward } from './schema/reward.schema';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<Reward>) {}

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
}
