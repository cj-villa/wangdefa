export enum TransactionType {
  /** 取款 */
  Withdrawal = 'withdrawal',
  /** 存款 */
  Deposit = 'deposit',
  /** 转账 */
  Transfer = 'transfer',
  /** 期初余额 */
  OpeningBalance = 'opening balance',
  /** 对账 */
  Reconciliation = 'reconciliation',
}
