import { Injectable } from '@nestjs/common';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';

@Injectable()
export class FinancialNetValueService {
  @InjectRepository(FinancialNetValueTrendEntity)
  private readonly financialNetValueTrendEntity: Repository<FinancialNetValueTrendEntity>;

  /** 获取某个时间点理财的净值 */
  async getFinancialNetValueTrend(
    financial: TrackFinancial,
    date: Date
  ): Promise<FinancialNetValueTrendEntity> {
    return this.financialNetValueTrendEntity.findOneBy({
      code: financial.code,
      date: dayjs(date).startOf('day').toDate(),
    });
  }
}
