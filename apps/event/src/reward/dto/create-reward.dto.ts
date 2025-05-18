import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { RewardDto } from './reward.dto';

export class CreateRewardDto extends RewardDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: new Types.ObjectId(),
  })
  @IsMongoId()
  eventId: Types.ObjectId;
}
