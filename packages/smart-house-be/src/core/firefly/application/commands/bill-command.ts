// 订单识别后的数据结构
export class BillCommand {
    // 交易时间
    dateTime: string;
    // 交易分类
    category: string;
    // 交易对方
    counterparty: string;
    // 对方账号
    counterpartyAccount: string;
    // 商品说明
    description: string;
    // 收入/支出
    direction: string;
    // 金额
    amount: string;
    // 收/付款方式
    paymentMethod: string;
    // 交易状态
    status: string;
    // 交易订单号
    tradeNo: string;
    // 商家订单号
    merchantOrderNo: string;
    // 备注
    remark: string;
}

// {
//     "dateTime": "2025-12-24 11:11:43",
//     "category": "餐饮美食",
//     "counterparty": "淘宝闪购",
//     "counterpartyAccount": "e50***@alibaba-inc.com",
//     "description": "渝八两重庆鸡公煲(萧山万象汇店)外卖订单",
//     "direction": "支出",
//     "amount": "20.80",
//     "paymentMethod": "云闪付-招商银行(4433)",
//     "status": "交易成功",
//     "tradeNo": "2025122422001175871420785762",
//     "merchantOrderNo": "13110600725122496316035460088",
//     "remark": ""
// }