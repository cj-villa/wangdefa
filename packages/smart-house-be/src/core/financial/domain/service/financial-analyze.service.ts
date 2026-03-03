import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FinancialDetailDto } from '@/core/financial/application/dto/financial-detail-dto';
import { FinancialSummaryDto } from '@/core/financial/application/dto/financial-summary-dto';
import { FinancialDetailQuery } from '@/core/financial/application/query/financial-detail.query';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { FinancialValueTrendEntity } from '@/core/financial/domain/entities/financial-value-trend.entity';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { JwtUser } from '@/core/user';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { sum } from '@/shared/toolkits/array';

@Injectable()
export class FinancialAnalyzeService {
  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @InjectRepository(FinancialValueTrendEntity)
  private readonly financialValueTrendRepo: Repository<FinancialValueTrendEntity>;

  @InjectRepository(FinancialNetValueTrendEntity)
  private readonly financialNetValueTrendRepo: Repository<FinancialNetValueTrendEntity>;

  @InjectRepository(FinancialTransaction)
  private readonly transactionRepo: Repository<FinancialTransaction>;

  @InjectRequest('user')
  private user: JwtUser;

  // 获取某一个理财产品或所有理财产品的统计信息
  async getSummary(financialId?: string) {
    const financials = await this.trackFinancialRepo.findBy({
      ...(financialId ? { id: financialId } : {}),
      userId: this.user.userId,
    });
    const summary = new FinancialSummaryDto();
    if (!financials?.length) {
      return summary;
    }
    const financialIds = financials.map((item) => item.id);
    summary.productCount = financials.length;
    /** 总资产 */
    const latestValues = await this.financialValueTrendRepo
      .createQueryBuilder('vt')
      .innerJoin(
        (qb) =>
          qb
            .select('v.financial_id', 'financial_id')
            .addSelect('MAX(v.date)', 'maxDate')
            .from(FinancialValueTrendEntity, 'v')
            .where('v.financial_id IN (:...financialIds)', { financialIds })
            .groupBy('v.financial_id'),
        't',
        't.financial_id = vt.financial_id AND t.maxDate = vt.date'
      )
      .select([
        'vt.financial_id AS financial_id',
        'vt.date AS date',
        'vt.balance as balance',
        'vt.shares as shares',
        'vt.profit as profit',
      ])
      .where('vt.financial_id IN (:...financialIds)', { financialIds })
      .getRawMany();
    summary.totalAssets = sum(latestValues, 'balance');
    summary.shares = sum(latestValues, 'shares');
    /** 总支出 */
    const totalTransaction = await this.transactionRepo.findBy({
      userId: this.user.userId,
      financialId: In(financialIds),
    });
    summary.totalCost = sum(totalTransaction, 'value');
    /** 最近一日的收益 */
    summary.preDayProfit = sum(latestValues, 'profit');
    return summary;
  }

  // 获取理财详情
  async getFinancialDetail(query: FinancialDetailQuery): Promise<FinancialDetailDto> {
    const { id } = query;

    // 获取理财基本信息
    const financial = await this.trackFinancialRepo.findOneBy({
      id,
      userId: this.user.userId,
    });

    if (!financial) {
      throw new Error('理财记录不存在');
    }

    const summary = await this.getSummary(id);
    const valueTrends = await this.financialValueTrendRepo.find({
      where: { financialId: id },
      order: { date: 'asc' },
    });
    const netValueTrends = await this.financialNetValueTrendRepo.find({
      where: { code: financial.code },
      order: { date: 'asc' },
    });

    return {
      financial,
      totalAssets: summary.totalAssets,
      totalCost: summary.totalCost,
      preDayProfit: summary.preDayProfit,
      shares: summary.shares,
      valueTrends,
      netValueTrends,
    };
  }
}
