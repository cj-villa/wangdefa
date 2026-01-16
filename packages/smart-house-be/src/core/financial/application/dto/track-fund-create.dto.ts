import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TrackFundCreateDto {
  @ApiProperty({ example: ['招行理财10天期'] })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: ['ZH001'] })
  @IsNotEmpty()
  code: string;
}
