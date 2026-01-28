import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumberString, IsOptional, IsDate } from 'class-validator';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';

export class TrackFinancialTransactionUpdateDto {
  @ApiProperty({ example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b', description: '交易记录ID' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b',
    description: '基金ID',
    required: false,
  })
  @IsOptional()
  financialId?: string;

  @ApiProperty({
    example: FinancialTransactionType.BUY,
    enum: FinancialTransactionType,
    description: '交易类型：BUY-买入，SELL-卖出',
    required: false,
  })
  @IsOptional()
  @IsEnum(FinancialTransactionType)
  transactionType?: FinancialTransactionType;

  @ApiProperty({ example: '10000.00', description: '交易金额', required: false })
  @IsOptional()
  @IsNumberString({ no_symbols: false })
  amount?: number;

  @ApiProperty({ example: '1000.0000', description: '交易份额', required: false })
  @IsOptional()
  @IsNumberString({ no_symbols: false })
  shares?: number;

  @ApiProperty({ example: '10.0000', description: '交易价格', required: false })
  @IsOptional()
  @IsNumberString({ no_symbols: false })
  transactionPrice?: number;

  @ApiProperty({ example: '2024-01-01T10:00:00Z', description: '交易日期', required: false })
  @IsNotEmpty()
  @IsDate()
  transactionDate?: Date;

  @ApiProperty({ example: '2024-01-01T10:00:00Z', description: '确认份额的时间', required: false })
  @IsNotEmpty()
  @IsDate()
  ensureDate?: Date;
}
