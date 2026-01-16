// firefly ai处理后的的数据结构
export class JournalCommand {
    /** 交易类型 */
    type: 'expense' | 'income' | 'transfer';
    /** 交易金额 */
    amount: number;
    // /** 交易时间 */
    time: string;
    /** 交易标签 */
    tag: string;
    /** 交易预算 */
    budget: string;
    /** 交易分类 */
    category: string;
    /** 交易来源账户 */
    source: string;
    /** 交易目标账户 */
    target: string;
    /** 交易描述 */
    description: string;
    /** 交易交易号 */
    tradeNo: string;
    /** 解析前的数据 */
    hint: string;
}


// {
//   "type": "expense",
//   "amount": 20.8,
//   "time": "2025-12-24 11:11:43",
//   "tag": "",
//   "budget": "",
//   "category": "",
//   "source": "云闪付-招商银行(4433)",
//   "target": "现金账户",
//   "description": "渝八两重庆鸡公煲(萧山万象汇店)外卖订单",
//   "tradeNo": "2025122422001175871420785762"
// },