import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumberString } from 'class-validator';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import { ObjectType } from 'typeorm';

export class SystemConfigUpdateDto {
  @ApiProperty({ example: 'db', description: '配置修改的key' })
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: '{mysql: false}',
    description: '修改后的key',
  })
  @IsNotEmpty()
  data: Object;
}
