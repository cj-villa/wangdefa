import { IsDefined, MaxLength } from 'class-validator';
import type { UserModel } from '../../model';
import type { InsertType } from '../../type-gymnastics/insert-type';

export class RegisterDTO implements InsertType<UserModel> {
  @MaxLength(32, {
    message: '用户名不可长于32位',
  })
  @IsDefined({ message: '用户名不可为空' })
  userName!: string;

  @MaxLength(128, {
    message: '密码不可长于32位',
  })
  @IsDefined({ message: '密码不可为空' })
  password!: string;
}
