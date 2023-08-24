import { IsDefined } from 'class-validator';
import type { UserModel } from '../model';
import type { InsertType } from '../type-gymnastics/insert-type';

export class LoginDTO implements InsertType<UserModel> {
  @IsDefined({ message: '用户名不可为空' })
  userName!: string;

  @IsDefined({ message: '密码不可为空' })
  password!: string;
}
