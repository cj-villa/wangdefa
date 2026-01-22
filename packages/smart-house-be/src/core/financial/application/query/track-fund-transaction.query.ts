import { FundTransactionType } from '@/core/financial/application/enum/fund-transaction-type';
import { PaginationQuery } from '@/core/common/application/query/pagination.query';

export class TrackFundTransactionQuery extends PaginationQuery {
  fundId?: string;
  transactionType?: FundTransactionType;
}
