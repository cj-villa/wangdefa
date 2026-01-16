import { IsOptional } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  current?: number = 1;

  @IsOptional()
  pageSize?: number = 10;
}
