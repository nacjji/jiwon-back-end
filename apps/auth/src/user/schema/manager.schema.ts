import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'manager', timestamps: true })
export class Manager {
  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['OPERATOR', 'AUDITOR', 'ADMIN'] })
  userType: 'OPERATOR' | 'AUDITOR' | 'ADMIN';

  @Prop({ required: true, unique: false })
  name: string;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
