export enum BillFieldType {
  /** 交易时间 */
  DateTime = 'dateTime',
  /** 分类，如：餐饮/交通/购物等 */
  Category = 'category',
  /** 交易对方 */
  Counterparty = 'counterparty',
  /** 交易对方账号 */
  CounterpartyAccount = 'counterpartyAccount',
  /** 交易描述 */
  Description = 'description',
  /** 交易方向，收入/支出 */
  Direction = 'direction',
  /** 交易金额 */
  Amount = 'amount',
  /** 支付方式，支付宝/银行卡等 */
  PaymentMethod = 'paymentMethod',
  /** 交易状态，交易成功等 */
  Status = 'status',
  /** 交易订单号 */
  TradeNo = 'tradeNo',
  /** 商户订单号 */
  MerchantOrderNo = 'merchantOrderNo',
  /** 备注 */
  Remark = 'remark',
}
