import { PaginationQuery } from '@/core/common/application/query/pagination.query';

export class TrackFundQuery extends PaginationQuery {
    code?: string;
    name?: string;
}
