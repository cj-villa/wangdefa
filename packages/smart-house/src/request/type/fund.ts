export interface Fund {
  id: string;
  name: string;
  code: string;
}

export enum FundTransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface FundTransaction {
  id: string;
  fundId: string;
  fundName?: string;
  fundCode?: string;
  transactionType: FundTransactionType;
  amount: number;
  shares: number;
  transactionPrice: number;
  transactionDate: string;
  createdAt?: string;
  updatedAt?: string;
}