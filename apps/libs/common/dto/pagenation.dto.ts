import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PagenationDto {
  @ApiProperty({
    description: '페이지 번호',
    example: 1,
  })
  @IsInt()
  page: number;

  @ApiProperty({
    description: '페이지 크기',
    example: 10,
  })
  @IsInt()
  limit: number;

  @ApiPropertyOptional({
    description: '검색어',
    example: '황금마차',
  })
  @IsOptional()
  @IsString()
  search: string;
}
