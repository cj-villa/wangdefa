import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({ description: 'token名称', example: 'github-ci-token' })
  @IsNotEmpty()
  name: string;
}
