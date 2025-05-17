import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class EventDetailDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: new Types.ObjectId(),
  })
  @IsMongoId()
  id: Types.ObjectId;
}
