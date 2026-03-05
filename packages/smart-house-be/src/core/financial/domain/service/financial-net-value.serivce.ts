import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { LessThanOrEqual, Repository } from 'typeorm';
import { FinancialNetValueQuery } from '@/core/financial/application/query/financial-net-value.query';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { InjectLogger, LokiLogger } from '@/interface/decorate/inject-logger';

@Injectable()
export class FinancialNetValueService {
  @InjectRepository(FinancialNetValueTrendEntity)
  private readonly financialNetValueTrendEntity: Repository<FinancialNetValueTrendEntity>;

  @InjectLogger(FinancialNetValueService.name)
  private readonly logger: LokiLogger;

  async getNetValueList(query: FinancialNetValueQuery) {
    const { code, current = 1, pageSize = 10, extraLimit = 0 } = query;
    return this.financialNetValueTrendEntity.findAndCount({
      where: { code },
      order: { date: 'DESC' },
      take: Number(pageSize) + Number(extraLimit),
      skip: (current - 1) * pageSize,
    });
  }

  /** 获取某个时间点理财的净值 */
  async getFinancialNetValueTrend(
    financial: TrackFinancial,
    date: Date
  ): Promise<FinancialNetValueTrendEntity> {
    return this.financialNetValueTrendEntity.findOne({
      where: {
        code: financial.code,
        date: LessThanOrEqual(dayjs(date).toDate()),
      },
      order: { date: 'DESC' },
    });
  }

  async getFinancialNetValueTrendByExistingDays(
    financial: TrackFinancial,
    date: Date,
    days: number
  ): Promise<FinancialNetValueTrendEntity> {
    const offsetDays = Math.max(Number(days) || 0, 0);
    const trends = await this.financialNetValueTrendEntity.find({
      where: {
        code: financial.code,
        date: LessThanOrEqual(dayjs(date).toDate()),
      },
      order: { date: 'DESC' },
      take: offsetDays + 1,
    });
    const trend = trends[offsetDays];
    if (!trend) {
      this.logger.warn(
        `净值记录不足: code=${financial.code}, date=${dayjs(date).format(
          'YYYY-MM-DD'
        )}, needOffset=${offsetDays}, found=${trends.length}`
      );
      throw new BadRequestException(`有效净值不足，无法获取向前${offsetDays}天的净值`);
    }
    return trend;
  }
}
