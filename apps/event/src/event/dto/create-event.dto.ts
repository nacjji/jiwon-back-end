import { ApiProperty } from '@nestjs/swagger';
import {
  EventStatus,
  EventType,
} from 'apps/event/src/event/schema/event.schema';
import { RewardType } from 'apps/event/src/reward/schema/reward.schema';
import { Types } from 'mongoose';

export class CreateEventDto {
  @ApiProperty({
    description: '이벤트 제목',
    example: '이벤트 제목',
  })
  title: string;

  @ApiProperty({
    description: '이벤트 설명',
    example: '이벤트 설명',
  })
  description: string;

  @ApiProperty({
    description: '이벤트 타입',
    example: EventType.ATTENDANCE,
    enum: EventType,
  })
  type: EventType;

  @ApiProperty({
    description: '이벤트 상태',
    example: EventStatus.ACTIVE,
    enum: EventStatus,
  })
  status: EventStatus;

  @ApiProperty({
    description: '이벤트 시작일',
    example: new Date(),
  })
  startDate: Date;

  @ApiProperty({
    description: '이벤트 종료일',
    example: new Date(),
  })
  endDate: Date;

  @ApiProperty({
    description: '이벤트 조건',
    example: {
      description: '3일 연속 출석',
    },
  })
  conditions: {
    description: string;
  };

  @ApiProperty({
    description: '이벤트 보상',
    example: [
      {
        type: RewardType.ITEM,
        quantity: 1,
        itemId: new Types.ObjectId().toString(),
      },
    ],
  })
  rewards: {
    type: RewardType;
    quantity: number;
    itemId?: string;
    exp?: number;
    meso?: number;
  }[];
}
