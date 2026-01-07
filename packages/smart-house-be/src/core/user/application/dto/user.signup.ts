import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSignUpDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
