import { TransactionType } from '@/core/firefly/application/enum/transaction-type';

export class FireflyTransaction {
  /** 交易ID */
  id: string;
  /** 交易类型：withdrawal, deposit, transfer */
  type: TransactionType;
  /** 交易日期 */
  date: string;
  /** 金额 */
  amount: string;
  /** 描述 */
  description: string;
  /** 订单号 */
  order: number;
  /** 货币ID */
  currency_id: string;
  /** 货币代码 */
  currency_code: string;
  /** 货币符号 */
  currency_symbol: string;
  /** 货币小数位数 */
  currency_decimal_places: number;
  /** 外币金额 */
  foreign_amount?: string;
  /** 外币ID */
  foreign_currency_id?: string;
  /** 外币代码 */
  foreign_currency_code?: string;
  /** 外币符号 */
  foreign_currency_symbol?: string;
  /** 外币小数位数 */
  foreign_currency_decimal_places?: number;
  /** 预算ID */
  budget_id?: string;
  /** 预算名称 */
  budget_name?: string;
  /** 分类ID */
  category_id?: string;
  /** 分类名称 */
  category_name?: string;
  /** 来源账户ID */
  source_id: string;
  /** 来源账户名称 */
  source_name: string;
  /** 来源账户类型 */
  source_type: string;
  /** 目标账户ID */
  destination_id?: string;
  /** 目标账户名称 */
  destination_name?: string;
  /** 目标账户类型 */
  destination_type?: string;
  /** 是否已对账 */
  reconciled: boolean;
  /** 账单ID */
  bill_id?: string;
  /** 账单名称 */
  bill_name?: string;
  /** 标签列表 */
  tags: string[];
  /** 备注 */
  notes?: string;
  /** 内部引用 */
  internal_reference?: string;
  /** 外部引用 */
  external_reference?: string;
  /** 外部URL */
  external_url?: string;
  /** 是否已导入 */
  imported: boolean;
  /** 导入哈希值 */
  import_hash_v2?: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}
