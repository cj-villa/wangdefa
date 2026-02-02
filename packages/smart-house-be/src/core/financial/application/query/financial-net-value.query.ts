import { PaginationQuery } from '@/core/common/application/query/pagination.query';
import { IsNotEmpty, IsString } from 'class-validator';

export class FinancialNetValueQuery extends PaginationQuery {
  @IsString()
  @IsNotEmpty({ message: '基金编码不能为空' })
  code: string;
}
