import { AccountRole } from '../enum/account-role';
import { AccountType } from '../enum/account-type';
import { CurrencyCode } from '../enum/currency-code';
import { CreditCardType } from '../enum/credit-card-type';
import { LiabilityType } from '../enum/liability-type';

export class FireflyAccount {
  /** 账户名称 */
  name: string;
  /** 账户类型 */
  type: AccountType;
  /** 是否激活 */
  active: boolean;
  /** 账户角色 */
  account_role: AccountRole;

  /** 货币ID */
  currency_id: string;
  /** 货币名称 */
  currency_name: string;
  /** 货币代码 */
  currency_code: CurrencyCode;
  /** 货币符号 */
  currency_symbol: string;
  /** 货币小数位数 */
  currency_decimal_places: number;

  /** 当前余额 */
  current_balance: string;
  /** 当前余额日期 */
  current_balance_date?: string;

  /** 信用卡类型 */
  credit_card_type?: CreditCardType;
  /** 每月支付日期 */
  monthly_payment_date?: number;
  /** 负债类型 */
  liability_type?: LiabilityType;
  /** 负债金额 */
  liability_amount?: string;
  /** 负债开始日期 */
  liability_start_date?: string;

  /** 虚拟余额 */
  virtual_balance?: string;
  /** IBAN */
  iban?: string;
  /** BIC */
  bic?: string;

  /** 排序 */
  order?: number;
  /** 备注 */
  notes?: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}
