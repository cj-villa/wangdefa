/**
 * 计算基金每日的价值
 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import dayjs from 'dayjs';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';
import { calculation } from '@/shared/toolkits/array';
import { FinancialValueTrendEntity } from '@/core/financial/domain/entities/financial-value-trend.entity';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import { LokiLogger } from '@/shared/logger';
import { InjectLogger } from '@/interface/decorate/inject-logger';

@Injectable()
export class FinancialValueCleanService {
  @InjectLogger(FinancialValueCleanService.name)
  private logger: LokiLogger;

  @InjectRepository(FinancialNetValueTrendEntity)
  private financialTrendRepository: Repository<FinancialNetValueTrendEntity>;

  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @InjectRepository(FinancialValueTrendEntity)
  private readonly financialValueTrendEntity: Repository<FinancialValueTrendEntity>;

  @InjectRequest('user')
  private user: JwtUser;

  @Inject()
  private readonly trackFinancialTransactionService: TrackFinancialTransactionService;

  /** 计算某一段时间的万份收益总和，包含from，不包含to */
  private async addProfit(financial: TrackFinancial, from: dayjs.Dayjs, to: dayjs.Dayjs) {
    const trend = await this.financialTrendRepository.find({
      where: {
        code: financial.code,
        date: Between(from.startOf('day').toDate(), to.subtract(1, 'day').endOf('day').toDate()),
      },
      order: { date: 'asc' },
    });
    return calculation(trend, 'value', (prev, cur) => prev + Number(cur), 0);
  }

  // 计算万份年化的理财的某一天的当前账户余额
  private async calcProfitValue(
    financial: TrackFinancial,
    date: dayjs.Dayjs,
    // 上一次的交易情况
    valueTrend?: FinancialValueTrendEntity
  ) {
    if (valueTrend && dayjs(valueTrend.date).isAfter(date)) {
      throw new Error('传入的当前价值时间不能晚于当前时间');
    }
    let total = valueTrend ? valueTrend.balance : 0;
    // 中间有几次交易，需要计算每一次的收益
    const [transactions] = await this.trackFinancialTransactionService.list({
      financialId: financial.id,
      ...(valueTrend ? { from: dayjs(valueTrend.date).add(1, 'day').startOf('day').toDate() } : {}),
      to: date.toDate(),
      orderBy: 'ASC',
    });
    // 和上一次价值记录中间没有交易，直接通过万份收益进行累加
    if (!transactions.length && valueTrend) {
      const profit = await this.addProfit(
        financial,
        dayjs(valueTrend.date).add(1, 'day').startOf('day'),
        // 没有下一次的记录就直接计算到当天
        dayjs(date.add(1, 'day'))
      );
      total = total * (profit / 10000 + 1);
    }
    while (transactions.length) {
      let current = transactions.shift();
      // 已经计算到需要计算的日期之后就不计算了
      if (dayjs(current.ensureDate).isAfter(date)) {
        break;
      }
      // 不存在时用后面的交易记录来兜底
      let next = transactions[0];
      const profit = await this.addProfit(
        financial,
        dayjs(current.ensureDate),
        // 没有下一次的记录就直接计算到当天
        dayjs(next?.ensureDate ?? date.add(1, 'day'))
      );
      const shares = Number(
        current.transactionType === FinancialTransactionType.BUY ? current.amount : -current.amount
      );
      total = (total + shares) * (profit / 10000 + 1);
    }
    return total;
  }

  /**
   * 重新计算某一天基金的价值并记录
   */
  async calcFinancialValue(
    code: string,
    date: dayjs.ConfigType,
    valueTrend?: FinancialValueTrendEntity
  ) {
    // 自己没有该基金你处理个啥
    const financial = await this.trackFinancialRepo.findOneBy({ code, userId: this.user.userId });
    if (!financial) {
      throw new BadRequestException('基金不存在');
    }
    const dayjsFrom = dayjs(date);
    // 一直往前取，没有的话就爆炸
    const netValue = await this.financialTrendRepository.findOne({
      where: { code, date: LessThanOrEqual(dayjsFrom.toDate()) },
      order: { date: 'desc' },
    });
    if (!netValue) {
      throw new BadRequestException('基金净值不存在');
    }
    const { type, value } = netValue;
    // 这个时间点当前理财的价值
    let financialValue = 0;
    // 净值类型的基金价值直接计算
    if (type === 'net') {
      const currentShares = await this.trackFinancialTransactionService.getFinancialShares(
        financial,
        dayjsFrom.toDate()
      );
      financialValue = currentShares ? value * currentShares : 0;
    }
    // 万份收益的需要把每一个阶段的价值都计算出来
    if (type === 'profit') {
      financialValue = await this.calcProfitValue(financial, dayjsFrom, valueTrend);
    }
    // upsert value trend
    const financialValueTrend = this.financialValueTrendEntity.create({
      financialId: financial.id,
      date: dayjsFrom.toDate(),
      balance: financialValue,
    });
    const currentTrend = await this.financialValueTrendEntity.findOneBy({
      financialId: financial.id,
      date: dayjsFrom.toDate(),
    });
    await (currentTrend
      ? this.financialValueTrendEntity.update(currentTrend.id, financialValueTrend)
      : this.financialValueTrendEntity.save(financialValueTrend));
    return financialValueTrend;
  }

  /** 从某天开始清理基金价值至最后有净值的一天 */
  async cleanFinancialValueTrend(code: string, from: dayjs.ConfigType) {
    const dayjsFrom = dayjs(from).startOf('day');
    const latestTrend = await this.financialTrendRepository.findOne({
      where: { code, date: MoreThanOrEqual(dayjsFrom.toDate()) },
      order: { date: 'desc' },
    });
    if (!latestTrend) {
      throw new BadRequestException('基金净值不存在');
    }
    const endDay = dayjs(latestTrend.date).startOf('day');
    let current = dayjsFrom;
    let prevValue: FinancialValueTrendEntity;
    while (!current.isAfter(endDay)) {
      prevValue = await this.calcFinancialValue(code, current, prevValue);
      this.logger.info(
        `基金${code}价值计算完成，日期${current.format('YYYY-MM-DD')},价值${prevValue.balance}`
      );
      current = current.add(1, 'day');
    }
  }
}
