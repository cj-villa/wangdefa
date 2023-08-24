import { BaseModel } from './base';
import { UserModel } from './user';

export enum BillSourceEnum {
  /** 支付宝订单 */
  AliPay = 'alipay',
  /** 微信订单 */
  Wechat = 'wechat',
}

export interface BillSourceModel extends BaseModel {
  /** 交易订单号 */
  orderNo: string;
  /** 商家订单号 */
  sellerOrderNo: string;
  /** 账单具体内容 */
  recordDetail: Record<string, string | number>;
  /** 账单来源 */
  source: BillSourceEnum;
  /** 上传人 */
  owner?: UserModel;
}
