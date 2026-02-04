import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FinancialDetailQuery {
  @ApiProperty({ description: '理财ID' })
  @IsNotEmpty()
  id: string;
}
