import { request } from './request';
import type { Page } from 'src/request/type/common';
import type { Fund, FundTransaction, FundTransactionType } from 'src/request/type/fund';

export default {
  /** token */
  listToken: (params: Page) => request.get('/api/token/list', { params }),
  createToken: (data: { name: string }) => request.post('/api/token/create', data),
  deleteToken: (data: { id: string }) => request.post('/api/token/delete', data),
  /** 理财相关 */
  listFund: (params: Page & Partial<Omit<Fund, 'id'>>) => request.get('/api/fund/list', { params }),
  createFund: (data: Omit<Fund, 'id'>) => request.post('/api/fund/create', data),
  deleteFund: (data: { id: string }) => request.post('/api/fund/delete', data),
  updateFund: (data: Fund) => request.post('/api/fund/update', data),
  /** 基金交易相关 */
  listFundTransaction: (params: Page & { fundId?: string; transactionType?: FundTransactionType }) => 
    request.get('/api/fund/transaction/list', { params }),
  createFundTransaction: (data: Omit<FundTransaction, 'id'>) => request.post('/api/fund/transaction/create', data),
  deleteFundTransaction: (data: { id: string }) => request.post('/api/fund/transaction/delete', data),
  updateFundTransaction: (data: FundTransaction) => request.post('/api/fund/transaction/update', data),
};