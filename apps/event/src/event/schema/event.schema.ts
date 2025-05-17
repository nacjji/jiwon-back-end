import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum EventType {
  ATTENDANCE = 'ATTENDANCE', // 출석
  INVITE = 'INVITE', // 친구 초대
  LEVEL_UP = 'LEVEL_UP', // 레벨업
}

export enum EventStatus {
  ACTIVE = 'ACTIVE', // 활성
  INACTIVE = 'INACTIVE', // 비활성
  SCHEDULED = 'SCHEDULED', // 예정
  ENDED = 'ENDED', // 종료
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: EventType })
  type: EventType;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.ACTIVE })
  status: EventStatus;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Object, required: true })
  conditions: {
    description: string; // 조건 설명
  };

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, required: false })
  deletedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
