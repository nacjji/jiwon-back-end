import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum RewardType {
  ITEM = 'ITEM', // 아이템
  EXP = 'EXP', // 경험치
  MESO = 'MESO', // 메소
}

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }] })
  type: RewardType;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop({ required: false })
  itemId?: string;

  @Prop({ required: false })
  exp?: number;

  @Prop({ required: false })
  meso?: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
