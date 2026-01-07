import { IsNotEmpty } from 'class-validator';

export class TokenDeleteDto {
  @IsNotEmpty()
  id: number;
}
