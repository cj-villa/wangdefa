import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import { PaginationQuery } from '@/core/common/application/query/pagination.query';

export class TrackFinancialTransactionQuery extends PaginationQuery {
  financialId?: string;
  transactionType?: FinancialTransactionType;
  from?: Date;
  to?: Date;
  orderBy?: 'ASC' | 'DESC';
}
