import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { FinancialNetValueQuery } from '@/core/financial/application/query/financial-net-value.query';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';

@Injectable()
export class FinancialNetValueService {
  @InjectRepository(FinancialNetValueTrendEntity)
  private readonly financialNetValueTrendEntity: Repository<FinancialNetValueTrendEntity>;

  async getNetValueList(query: FinancialNetValueQuery) {
    const { code, current = 1, pageSize = 10 } = query;
    return this.financialNetValueTrendEntity.findAndCount({
      where: { code },
      order: { date: 'DESC' },
      take: pageSize,
      skip: (current - 1) * pageSize,
    });
  }

  /** 获取某个时间点理财的净值 */
  async getFinancialNetValueTrend(
    financial: TrackFinancial,
    date: Date
  ): Promise<FinancialNetValueTrendEntity> {
    return this.financialNetValueTrendEntity.findOneBy({
      code: financial.code,
      date: dayjs(date).toDate(),
    });
  }
}
