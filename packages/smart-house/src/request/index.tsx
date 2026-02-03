import { request } from './request';
import type { Page } from 'src/request/type/common';
import {
  Financial,
  FinancialSummary,
  FinancialTransaction,
  FinancialTransactionType,
} from 'src/request/type/financial';
import { UpdateSystemConfigRequest } from 'src/request/type/system';

export default {
  /** system */
  // 管理token
  listToken: (params: Page) => request.get('/api/token/list', { params }),
  createToken: (data: { name: string }) => request.post('/api/token/create', data),
  deleteToken: (data: { id: string }) => request.post('/api/token/delete', data),
  // 系统配置
  listSystemConfig: (params?: { search?: string; current?: number; pageSize?: number }) =>
    request.get('/api/system/config/list', { params }),
  getSystemConfig: (key: string) => request.get(`/api/system/config/detail`, { params: { key } }),
  updateSystemConfig: (data: UpdateSystemConfigRequest) =>
    request.post('/api/system/config/update', data),

  /** 理财相关 */
  listFinancial: (params: Page & Partial<Omit<Financial, 'id'>>) =>
    request.get('/api/financial/list', { params }),
  createFinancial: (data: Omit<Financial, 'id'>) => request.post('/api/financial/create', data),
  deleteFinancial: (data: { id: string }) => request.post('/api/financial/delete', data),
  updateFinancial: (data: Financial) => request.post('/api/financial/update', data),
  updateFinancialValue: (data: { code: string; from?: number }) =>
    request.post('/api/financial/clean', data),
  updateFinancialNetValue: (data: { code: string; from?: number }) =>
    request.post('/api/financial/net-value/clean', data),
  listFinancialNetValue: (params: { code: string }) =>
    request.get('/api/financial/net-value/list', { params }),

  /** 理财交易相关 */
  listFinancialTransaction: (
    params: Page & { financialId?: string; transactionType?: FinancialTransactionType }
  ) => request.get('/api/financial/transaction/list', { params }),
  createFinancialTransaction: (data: Omit<FinancialTransaction, 'id'>) =>
    request.post('/api/financial/transaction/create', data),
  deleteFinancialTransaction: (data: { id: string }) =>
    request.post('/api/financial/transaction/delete', data),
  updateFinancialTransaction: (data: FinancialTransaction) =>
    request.post('/api/financial/transaction/update', data),

  /** 理财详情相关 */
  getFinancialSummary: () => request.get<null, FinancialSummary>('/api/financial-analyze/summary'),
  getFinancialDetail: (params: { id: string; range?: 'day' | 'week' | 'month' | 'year' }) =>
    request.get('/api/financial/detail', { params }),
};
