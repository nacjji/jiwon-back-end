import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { RewardType } from '../schema/reward.schema';

export class CreateRewardDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: new Types.ObjectId(),
  })
  @IsMongoId()
  eventId: Types.ObjectId;

  @ApiProperty({
    description: '보상 타입',
    example: RewardType.ITEM,
    enum: RewardType,
  })
  type: RewardType;

  @ApiProperty({
    description: '아이템 ID',
    example: new Types.ObjectId(),
  })
  @IsMongoId()
  itemId?: Types.ObjectId;

  @ApiProperty({
    description: '경험치',
    example: 100,
  })
  @IsNumber()
  exp?: number;
}
