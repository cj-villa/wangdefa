export interface Financial {
  id: string;
  name: string;
  code: string;
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