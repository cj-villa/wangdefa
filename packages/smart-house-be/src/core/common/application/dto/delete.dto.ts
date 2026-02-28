import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @ApiProperty({ description: '待删除记录ID', example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b' })
  @IsNotEmpty()
  id: string;
}
