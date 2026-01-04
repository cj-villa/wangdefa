import { TransactionType } from '../enum/transaction-type';

export class FireflyTransaction {
  // 基本
  /** 用户ID */
  user: string;
  /** 交易组ID */
  transaction_group_id: string;
  /** 交易类型 */
  type: TransactionType;

  // 描述
  description: string;
  /** 备注 */
  notes?: string;

  // 金额
  amount: string;
  /** 外币金额 */
  foreign_amount?: string;
  foreign_currency_id?: string;
  foreign_currency_code?: string;

  // 账户
  source_id?: string;
  source_name?: string;
  destination_id?: string;
  destination_name?: string;

  // 分类 / 标签
  category_id?: string;
  category_name?: string;
  budget_id?: string;
  budget_name?: string;
  tags?: string[];

  // 日期
  date: string;
  interest_date?: string;
  book_date?: string;
  process_date?: string;
  due_date?: string;
  payment_date?: string;

  // 状态
  reconciled: boolean;
  bill_id?: string;
  bill_name?: string;

  // 拆分 / 内部转账
  order?: number;
  internal_reference?: string;

  // 系统
  created_at: string;
  updated_at: string;
}
