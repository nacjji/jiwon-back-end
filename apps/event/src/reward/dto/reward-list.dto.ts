import { ApiPropertyOptional } from '@nestjs/swagger';
import { PagenationDto } from 'apps/libs/common/dto/pagenation.dto';
import { IsIn, IsOptional } from 'class-validator';
import { UserRewardStatus } from '../schema/user-reward.schema';

export class RewardListDto extends PagenationDto {
  @ApiPropertyOptional({
    description: '보상 상태',
    example: UserRewardStatus.REQUESTED,
    enum: UserRewardStatus,
  })
  @IsOptional()
  @IsIn(Object.values(UserRewardStatus), {
    message: '보상 상태는 유효하지 않습니다.',
  })
  rewardStatus: UserRewardStatus;
}
