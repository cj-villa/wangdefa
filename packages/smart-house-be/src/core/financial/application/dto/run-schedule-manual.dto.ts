import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class RunScheduleManualDto {
  @ApiPropertyOptional({
    description: '手动执行时回溯天数，必须为数字，且大于1小于31',
    minimum: 2,
    maximum: 30,
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'delay must be an integer number' })
  @Min(2, { message: 'delay must be greater than 1' })
  @Max(30, { message: 'delay must be less than 31' })
  delay?: number;
}
