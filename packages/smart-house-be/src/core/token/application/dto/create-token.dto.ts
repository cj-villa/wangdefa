import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({ description: 'token名称', example: 'github-ci-token' })
  @IsNotEmpty()
  name: string;
}
