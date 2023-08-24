/**
 * 账单转换规则集
 */
import { BaseModel } from './base';
import { BillSourceEnum } from './bill-source';
import { BillConverterModel } from './bill-converter';
import { UserModel } from './user';

export enum BillConvertRuleAction {
  OR = 'or',
  AND = 'and',
}

export enum BillConvertRuleOperator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GREATER = '>',
  LESS = '<',
  GREATER_OR_EQUAL = '>=',
  LESS_OR_EQUAL = '<=',
  CONTAINER = 'container',
  NOT_CONTAINER = '!container',
  REGULAR = 'regular',
  Any = 'any',
}

export interface BillConvertRuleModel extends BaseModel {
  /** 适用转换的账单类型 */
  billSource?: BillSourceEnum;
  /** 判断逻辑，与｜或 */
  action: BillConvertRuleAction;
  /** 需要判断的字段 */
  source: string;
  /** 判断的操作符 */
  operator: BillConvertRuleOperator;
  /** 右边的值 */
  right: string;
  /** 归属的转换规则集 */
  converter?: BillConverterModel;
  /** 上传人 */
  owner?: UserModel;
}
