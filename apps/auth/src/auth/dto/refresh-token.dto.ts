import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'refreshToken',
    required: true,
  })
  @IsNotEmpty()
  refreshToken: string;
}
