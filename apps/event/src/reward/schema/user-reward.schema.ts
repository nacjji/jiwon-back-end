import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum UserRewardStatus {
  REQUESTED = 'REQUESTED', // 요청됨
  APPROVED = 'APPROVED', // 승인됨
  REWARDED = 'REWARDED', // 보상됨
}

@Schema({
  collection: 'user_rewards',
})
export class UserReward {
  @Prop({})
  userId: Types.ObjectId;

  @Prop()
  eventId: Types.ObjectId;

  @Prop({ required: true, enum: UserRewardStatus })
  status: UserRewardStatus;
}

export const UserRewardSchema = SchemaFactory.createForClass(UserReward);
