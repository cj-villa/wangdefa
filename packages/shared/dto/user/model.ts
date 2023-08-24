import { IsDefined } from 'class-validator';
import type { BaseModel } from '../../model';

export class UserDeleteDTO implements Pick<BaseModel, 'id'> {
  @IsDefined({ message: 'id不可为空' })
  id!: string;
}
