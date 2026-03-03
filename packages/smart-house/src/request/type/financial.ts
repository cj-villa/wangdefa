export interface Financial {
  id: string;
  name: string;
  code: string;
  channel: string;
  totalFee?: number;
  balance?: number;
  totalProfit?: number;
  preDayProfit?: number;
}

export interface FinancialDetail {
  financial: Financial;
  totalAssets: number;
  totalCost: number;
  totalFee: number;
  preDayProfit: number;
  shares: number;
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
  fee?: number;
  transactionType: FinancialTransactionType;
  amount: number;
  shares: number;
  transactionPrice: number;
  transactionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialTransactionUpsertPayload {
  id?: string;
  financialId: string;
  transactionType: FinancialTransactionType;
  amount: string;
  fee: string;
  transactionDate: string;
  ensureDate: string;
}

export interface FinancialSummary {
  // 总资产
  totalAssets: number;
  // 总支出
  totalCost: number;
  totalFee: number;
  // 累计收益
  totalProfit: number;
  // 昨日收益
  preDayProfit: number;
  // 产品数量
  productCount: number;
}
