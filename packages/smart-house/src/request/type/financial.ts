export interface Financial {
  id: string;
  name: string;
  code: string;
  balance?: number;
  totalProfit?: number;
  yesterdayProfit?: number;
}

export interface FinancialDetail {
  financial: Financial;
  netValueTrends: Array<{
    date: string;
    value: number;
    type: 'net' | 'profit';
  }>;
  valueTrends: Array<{
    date: string;
    balance: number;
    shares?: number;
  }>;
  transactions: FinancialTransaction[];
  statistics: {
    totalProfit: number;
    yesterdayProfit: number;
    currentBalance: number;
    totalInvestment: number;
    totalWithdrawal: number;
  };
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
  yesterdayProfit: number;
  // 产品数量
  productCount: number;
}
