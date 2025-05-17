import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { Reward, RewardSchema } from './schema/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  ],
  exports: [RewardService],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
