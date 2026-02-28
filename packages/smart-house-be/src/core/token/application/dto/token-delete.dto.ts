import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TokenDeleteDto {
  @ApiProperty({ description: 'token记录ID', example: 'f8b8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b' })
  @IsNotEmpty()
  id: string;
}
