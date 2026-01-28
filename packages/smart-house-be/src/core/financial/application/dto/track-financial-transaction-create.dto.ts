import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumberString, IsDate } from 'class-validator';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';

export class TrackFinancialTransactionCreateDto {
  @ApiProperty({ example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b', description: '基金ID' })
  @IsNotEmpty()
  financialId: string;

  @ApiProperty({
    example: FinancialTransactionType.BUY,
    enum: FinancialTransactionType,
    description: '交易类型：BUY-买入，SELL-卖出',
  })
  @IsNotEmpty()
  @IsEnum(FinancialTransactionType)
  transactionType: FinancialTransactionType;

  @ApiProperty({ example: '1000.0000', description: '交易份额' })
  @IsNotEmpty()
  @IsNumberString({ no_symbols: false })
  shares: number;

  @ApiProperty({ example: '2024-01-01T10:00:00Z', description: '交易日期' })
  @IsNotEmpty()
  @IsDate()
  transactionDate: Date;

  @ApiProperty({ example: '2024-01-01T10:00:00Z', description: '确认份额的时间' })
  @IsNotEmpty()
  @IsDate()
  ensureDate: Date;
}
