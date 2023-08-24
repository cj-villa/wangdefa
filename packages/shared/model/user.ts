import { BaseModel } from './base';

export interface UserModel extends BaseModel {
  userName: string;
  password: string;
}
