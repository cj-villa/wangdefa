import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignInDTO {
  @ApiProperty({ description: '用户名或邮箱', example: 'user@example.com' })
  @IsNotEmpty()
  usernameOrEmail: string;

  @ApiProperty({ description: '登录密码', example: 'P@ssw0rd!' })
  @IsNotEmpty()
  password: string;
}
