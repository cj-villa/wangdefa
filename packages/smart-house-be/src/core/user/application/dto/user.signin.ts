import { IsNotEmpty } from 'class-validator';

export class UserSignInDTO {
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsNotEmpty()
  password: string;
}
