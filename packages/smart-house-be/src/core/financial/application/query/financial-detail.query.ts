import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FinancialDetailQuery {
  @ApiProperty({ description: '理财ID' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '时间范围：day, week, month, year', required: false, default: 'month' })
  range?: 'day' | 'week' | 'month' | 'year';
}