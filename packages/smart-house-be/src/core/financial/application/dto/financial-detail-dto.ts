import { type TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { type FinancialValueTrendEntity } from '@/core/financial/domain/entities/financial-value-trend.entity';
import { type FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';

export class FinancialDetailDto {
  financial: TrackFinancial;
  // 总资产
  totalAssets: number = 0;
  // 总支出
  totalCost: number = 0;
  // 最近一个收益
  preDayProfit: number = 0;
  valueTrends: FinancialValueTrendEntity[];
  netValueTrends: FinancialNetValueTrendEntity[];
}
