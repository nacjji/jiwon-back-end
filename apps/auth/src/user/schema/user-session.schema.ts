import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserSession extends Document {
  // 유저 아이디
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // 리프레시 토큰
  @Prop({ required: true })
  refreshToken: string;

  @Prop({ type: Date, required: true, default: Date.now })
  lastUsedAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
