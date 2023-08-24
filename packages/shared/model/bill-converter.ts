/**
 * 账单转换规则集
 */
import { BaseModel } from './base';
import { UserModel } from './user';

export interface BillConverterModel extends BaseModel {
  /** 规则集的名称 */
  name: string;
  /** 上传人 */
  owner?: UserModel;
}
