import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../event/schema/event.schema';
import { UserEvent, UserEventSchema } from '../event/schema/user-event.schema';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { Reward, RewardSchema } from './schema/reward.schema';
import { UserReward, UserRewardSchema } from './schema/user-reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([
      { name: UserReward.name, schema: UserRewardSchema },
    ]),
    MongooseModule.forFeature([
      { name: UserEvent.name, schema: UserEventSchema },
    ]),
  ],
  exports: [RewardService],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
