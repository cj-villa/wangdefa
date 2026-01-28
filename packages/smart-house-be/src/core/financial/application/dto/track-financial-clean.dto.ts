import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class TrackFinancialCleanDto {
  @ApiProperty({ example: '对应的理财的code' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 1769396102095, description: '从该日期开始清洗，格式为时间戳' })
  @IsOptional()
  from: number;
}
