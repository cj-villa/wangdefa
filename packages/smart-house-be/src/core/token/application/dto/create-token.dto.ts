import { IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @IsNotEmpty()
  name: string;
}
