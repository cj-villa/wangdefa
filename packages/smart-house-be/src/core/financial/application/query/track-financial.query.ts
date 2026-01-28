import { PaginationQuery } from '@/core/common/application/query/pagination.query';

export class TrackFinancialQuery extends PaginationQuery {
  code?: string;
  name?: string;
}
