import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Event } from './event.schema';

@Schema({
  collection: 'user_events',
})
export class UserEvent {
  @Prop()
  userId: string;

  @Prop({
    ref: Event.name,
  })
  eventId: Types.ObjectId;

  title: string;

  // 참여일
  @Prop()
  joinedAt: Date;

  // 완료일
  @Prop()
  completedAt: Date;

  @Prop({ type: Object })
  progress: {
    // 출석 이벤트의 경우
    attendanceCount?: number;
    lastAttendanceDate?: Date;

    // 친구 초대 이벤트의 경우
    invitedFriends?: string[]; // 초대한 친구들의 ID
    inviteCount?: number;

    // 퀴즈 이벤트의 경우
    quizScore?: number;
    quizAttempts?: number;
    // ... 기타 진행 상황 추가 가능
  };
}

export const UserEventSchema = SchemaFactory.createForClass(UserEvent);
