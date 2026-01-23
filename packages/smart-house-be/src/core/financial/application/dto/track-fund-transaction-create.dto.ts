import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumberString } from 'class-validator';
import { FundTransactionType } from '@/core/financial/application/enum/fund-transaction-type';

export class TrackFundTransactionCreateDto {
  @ApiProperty({ example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b', description: '基金ID' })
  @IsNotEmpty()
  fundId: string;

  @ApiProperty({
    example: FundTransactionType.BUY,
    enum: FundTransactionType,
    description: '交易类型：BUY-买入，SELL-卖出',
  })
  @IsNotEmpty()
  @IsEnum(FundTransactionType)
  transactionType: FundTransactionType;

  @ApiProperty({ example: '1000.0000', description: '交易份额' })
  @IsNotEmpty()
  @IsNumberString({ no_symbols: false })
  shares: number;

  @ApiProperty({ example: '2024-01-01T10:00:00Z', description: '交易日期' })
  @IsNotEmpty()
  transactionDate: string;
}
