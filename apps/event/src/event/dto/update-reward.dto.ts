import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { RewardDto } from '../../reward/dto/reward.dto';
import { RewardType } from '../../reward/schema/reward.schema';
import { EventDetailDto } from './event-detail.dto';

export class UpdateRewardDto extends EventDetailDto {
  @ApiProperty({
    description: '보상 목록',
    example: [
      {
        type: RewardType.ITEM,
        quantity: 1,
        itemId: new Types.ObjectId().toString(),
      },
    ],
  })
  reward: RewardDto[];
}
