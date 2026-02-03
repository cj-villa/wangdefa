/**
 * 总结理财当前的价值、利润、与上一个交易日对比的利润
 */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';
import { FinancialValueTrendEntity } from '@/core/financial/domain/entities/financial-value-trend.entity';

@Injectable()
export class FinancialValueSummaryService {
  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @InjectRepository(FinancialValueTrendEntity)
  private readonly financialValueTrendEntity: Repository<FinancialValueTrendEntity>;

  @InjectRequest('user')
  private user: JwtUser;

  @Inject()
  private readonly trackFinancialTransactionService: TrackFinancialTransactionService;

  async getFinancialSummary(financialId: string) {
    const financial = await this.trackFinancialRepo.findOneBy({
      id: financialId,
      userId: this.user.userId,
    });
    if (!financial) {
      return {};
    }
    const latestValue = await this.financialValueTrendEntity.findOne({
      where: { financialId },
      order: { date: 'DESC' },
    });
    if (!latestValue) {
      return {};
    }
    const dayBeforeYesterdayValue = await this.financialValueTrendEntity.findOne({
      where: {
        financialId,
        date: LessThan(latestValue.date),
      },
      order: { date: 'DESC' },
    });
    if (!dayBeforeYesterdayValue) {
      return {
        balance: latestValue.balance,
      };
    }
    const totalCost = await this.trackFinancialTransactionService.getFinancialAmount(
      financial,
      latestValue.date
    );
    return {
      // 当前余额
      balance: latestValue.balance,
      // 昨日利润
      yesterdayProfit: latestValue.balance - dayBeforeYesterdayValue.balance,
      totalProfit: latestValue.balance - totalCost,
    };
  }
}
