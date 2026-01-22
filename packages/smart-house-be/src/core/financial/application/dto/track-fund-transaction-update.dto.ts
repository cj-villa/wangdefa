import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { FundTransactionType } from '@/core/financial/application/enum/fund-transaction-type';

export class TrackFundTransactionUpdateDto {
  @ApiProperty({ example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b', description: '交易记录ID' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b',
    description: '基金ID',
    required: false,
  })
  @IsOptional()
  fundId?: string;

  @ApiProperty({
    example: FundTransactionType.BUY,
    enum: FundTransactionType,
    description: '交易类型：BUY-买入，SELL-卖出',
    required: false,
  })
  @IsOptional()
  @IsEnum(FundTransactionType)
  transactionType?: FundTransactionType;

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
  @IsOptional()
  transactionDate?: string;
}
