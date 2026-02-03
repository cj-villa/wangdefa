import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { FinancialValueTrendEntity } from '@/core/financial/domain/entities/financial-value-trend.entity';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import dayjs from 'dayjs';
import { FinancialDetailQuery } from '@/core/financial/application/query/financial-detail.query';
import { FinancialSummaryDto } from '@/core/common/application/dto/financial-summary-dto';
import { sum } from '@/shared/toolkits/array';
import { groupBy, keyBy } from 'lodash';

export interface FinancialDetailData {
  // 基本信息
  financial: TrackFinancial;
  // 净值趋势数据
  netValueTrends: Array<{
    date: string;
    value: number;
    type: 'net' | 'profit';
  }>;
  // 价值趋势数据（余额）
  valueTrends: Array<{
    date: string;
    balance: number;
    shares?: number;
  }>;
  // 交易记录
  transactions: FinancialTransaction[];
  // 统计信息
  statistics: {
    totalProfit: number;
    yesterdayProfit: number;
    currentBalance: number;
    totalInvestment: number;
    totalWithdrawal: number;
  };
}

@Injectable()
export class FinancialAnalyzeService {
  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @InjectRepository(FinancialValueTrendEntity)
  private readonly financialValueTrendRepo: Repository<FinancialValueTrendEntity>;

  @InjectRepository(FinancialTransaction)
  private readonly transactionRepo: Repository<FinancialTransaction>;

  @InjectRepository(FinancialNetValueTrendEntity)
  private readonly netValueTrendRepo: Repository<FinancialNetValueTrendEntity>;

  @InjectRequest('user')
  private user: JwtUser;

  async getSummary() {
    const financials = await this.trackFinancialRepo.findBy({
      userId: this.user.userId,
    });
    const summary = new FinancialSummaryDto();
    if (!financials) {
      return;
    }
    summary.productCount = financials.length;
    const codes = financials.map((i) => i.code);
    const financialIds = financials.map((i) => i.id);
    /** 总资产 */
    const latestValues = await this.financialValueTrendRepo
      .createQueryBuilder('vt')
      .innerJoin(
        (qb) =>
          qb
            .select('v.financial_id', 'financial_id')
            .addSelect('MAX(v.date)', 'maxDate')
            .from(FinancialValueTrendEntity, 'v')
            .groupBy('v.financial_id'),
        't',
        't.financial_id = vt.financial_id AND t.maxDate = vt.date'
      )
      .select(['vt.financial_id AS financial_id', 'vt.date AS date', 'vt.balance as balance'])
      .getRawMany();
    summary.totalAssets = sum(latestValues, 'balance');
    /** 总支出 */
    const totalTransaction = await this.transactionRepo.findBy({ userId: this.user.userId });
    summary.totalCost = sum(totalTransaction, 'value');
    /** 前一日的收益，计算会有问题，因为大于 T+1 的情况会无法计算 */
    const latestNetValues = await this.netValueTrendRepo.findBy({
      code: In(codes),
      date: dayjs().subtract(1, 'day').toDate(),
    });
    summary.yesterdayProfit = await this.getYesterdayProfit(financials);
    return summary;
  }

  // TODO 有问题，回头修复，获取前一日的收益
  private async getYesterdayProfit(financials: TrackFinancial[]) {
    const yesterday = dayjs().subtract(1, 'day').toDate();
    const dayBeforeYesterday = dayjs().subtract(2, 'day').toDate();

    // 净值可能当日有新增，但是不能计算利润；年化就算两天减一天
    const latestValues = await this.financialValueTrendRepo.findBy({
      financialId: In(financials.map((i) => i.id)),
      date: dayBeforeYesterday,
    });
    const netValueTrends = await this.netValueTrendRepo.findBy({
      code: In(financials.map((i) => i.code)),
      date: In([yesterday, dayBeforeYesterday]),
    });
    const valueMap = keyBy(latestValues, 'code');
    const netValueMap = groupBy(netValueTrends, 'code');
    return financials.reduce((profit, financial) => {
      const value = valueMap[financial.code];
      const netValues = netValueMap[financial.code];
      if (!value || netValues?.length !== 2) {
        return profit;
      }
      const netValueKeyByDate = keyBy(netValues, (trend) => trend.date.getDate());
      const yesterdayNetValue = netValueKeyByDate[yesterday.getDate()];
      const dayBeforeYesterdayNetValue = netValueKeyByDate[dayBeforeYesterday.getDate()];

      if (!yesterdayNetValue || !dayBeforeYesterdayNetValue) {
        return profit;
      }
      if (yesterdayNetValue.type === 'net') {
        return profit + value.shares * (yesterdayNetValue.value - dayBeforeYesterdayNetValue.value);
      }
      if (yesterdayNetValue.type === 'profit') {
        return (
          profit + value.balance * (1 + dayBeforeYesterdayNetValue.value) * yesterdayNetValue.value
        );
      }
      return profit;
    }, 0);
  }

  async getFinancialDetail(query: FinancialDetailQuery): Promise<FinancialDetailData> {
    const { id, range = 'month' } = query;

    // 获取理财基本信息
    const financial = await this.trackFinancialRepo.findOneBy({
      id,
      userId: this.user.userId,
    });

    if (!financial) {
      throw new Error('理财记录不存在');
    }

    // 计算时间范围
    const now = dayjs();
    let startDate: dayjs.Dayjs;

    switch (range) {
      case 'day':
        startDate = now.subtract(1, 'day');
        break;
      case 'week':
        startDate = now.subtract(1, 'week');
        break;
      case 'month':
        startDate = now.subtract(1, 'month');
        break;
      case 'year':
        startDate = now.subtract(1, 'year');
        break;
      default:
        startDate = now.subtract(1, 'month');
    }

    // 获取净值趋势数据
    const netValueTrends = await this.netValueTrendRepo.find({
      where: {
        code: financial.code,
        date: Between(startDate.toDate(), now.toDate()),
      },
      order: { date: 'asc' },
    });

    // 获取价值趋势数据（余额）
    const valueTrends = await this.financialValueTrendRepo.find({
      where: {
        financialId: id,
        date: Between(startDate.toDate(), now.toDate()),
      },
      order: { date: 'asc' },
    });

    // 获取交易记录
    const transactions = await this.transactionRepo.find({
      where: {
        financialId: id,
        ensureDate: Between(startDate.toDate(), now.toDate()),
      },
      order: { ensureDate: 'desc' },
      take: 50, // 限制返回数量
    });

    // 计算统计信息
    const allTransactions = await this.transactionRepo.find({
      where: { financialId: id },
    });

    const totalInvestment = allTransactions
      .filter((t) => t.transactionType === 'BUY')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalWithdrawal = allTransactions
      .filter((t) => t.transactionType === 'SELL')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const currentBalance = valueTrends.length > 0 ? valueTrends[valueTrends.length - 1].balance : 0;

    const totalProfit = currentBalance - totalInvestment + totalWithdrawal;

    // 获取昨日收益（需要从价值摘要服务获取）
    const yesterdayProfit = 0; // 这里需要从现有服务获取

    return {
      financial,
      netValueTrends: netValueTrends.map((trend) => ({
        date: dayjs(trend.date).format('YYYY-MM-DD'),
        value: Number(trend.value),
        type: trend.type,
      })),
      valueTrends: valueTrends.map((trend) => ({
        date: dayjs(trend.date).format('YYYY-MM-DD'),
        balance: Number(trend.balance),
        // shares: trend.balance ? Number(trend.shares) : undefined
      })),
      transactions,
      statistics: {
        totalProfit,
        yesterdayProfit,
        currentBalance,
        totalInvestment,
        totalWithdrawal,
      },
    };
  }
}
