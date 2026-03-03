/** 理财汇总信息 */
export class FinancialSummaryDto {
  // 总资产
  totalAssets: number = 0;
  // 总份额
  shares: number = 0;
  // 总支出
  totalCost: number = 0;
  // 累计收益
  totalProfit: number = 0;
  // 累计手续费
  totalFee: number = 0;
  // 最近一个收益
  preDayProfit: number = 0;
  // 产品数量
  productCount: number = 0;
}
