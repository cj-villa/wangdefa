import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSignUpDTO {
  @ApiProperty({ description: '注册邮箱', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '登录密码', example: 'P@ssw0rd!' })
  @IsNotEmpty()
  password: string;
}
