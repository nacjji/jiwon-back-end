import { ApiProperty } from '@nestjs/swagger';

export class JoinEventDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: '6693b4999090909090909090',
  })
  eventId: string;
}
