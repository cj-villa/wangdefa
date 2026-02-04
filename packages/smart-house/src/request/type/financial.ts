export interface Financial {
  id: string;
  name: string;
  code: string;
  channel: string;
  balance?: number;
  totalProfit?: number;
  preDayProfit?: number;
}

export interface FinancialDetail {
  financial: Financial;
  totalAssets: number;
  totalCost: number;
  preDayProfit: number;
  valueTrends: any[];
  netValueTrends: any[];
}

export enum FinancialTransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface FinancialTransaction {
  id: string;
  financialId: string;
  financialName?: string;
  financialCode?: string;
  transactionType: FinancialTransactionType;
  amount: number;
  shares: number;
  transactionPrice: number;
  transactionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialSummary {
  // 总资产
  totalAssets: number;
  // 总支出
  totalCost: number;
  // 昨日收益
  preDayProfit: number;
  // 产品数量
  productCount: number;
}
