import { BaseModel } from './base';

export interface UserModel extends BaseModel {
  username: string;
  password: string;
}
