import { PaginationQuery } from '@/core/common/application/query/pagination.query';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';

export class TrackFinancialTransactionQuery extends PaginationQuery {
  financialId?: string;
  name?: string;
  code?: string;
  transactionType?: FinancialTransactionType;
  from?: Date;
  to?: Date;
  orderBy?: 'ASC' | 'DESC';
}
