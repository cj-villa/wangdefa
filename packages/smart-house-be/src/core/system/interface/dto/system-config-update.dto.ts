import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SystemConfigUpdateDto {
  @ApiProperty({ example: 'db', description: '配置修改的key' })
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: '{mysql: false}',
    description: '修改后的key',
  })
  @IsNotEmpty()
  data: Record<string, unknown>;
}
