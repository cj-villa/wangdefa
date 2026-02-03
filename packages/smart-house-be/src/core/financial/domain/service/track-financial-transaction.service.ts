/** 资金交易记录服务 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TrackFinancialTransactionCreateDto } from '@/core/financial/application/dto/track-financial-transaction-create.dto';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import { TrackFinancialTransactionUpdateDto } from '@/core/financial/application/dto/track-financial-transaction-update.dto';
import { TrackFinancialTransactionQuery } from '@/core/financial/application/query/track-financial-transaction.query';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { batchKeys, mergeEntity } from '@/shared/toolkits/sql';
import { FinancialNetValueService } from '@/core/financial/domain/service/financial-net-value.serivce';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';

@Injectable()
export class TrackFinancialTransactionService {
  @InjectRepository(FinancialTransaction)
  private readonly transactionRepo: Repository<FinancialTransaction>;

  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @Inject()
  private readonly financialNetValueService: FinancialNetValueService;

  @Inject()
  private readonly trackFinancialRecordService: TrackFinancialRecordService;

  @InjectRequest('user')
  private user: JwtUser;

  /** 创建交易记录 */
  async create(data: TrackFinancialTransactionCreateDto) {
    // 检查基金是否存在且属于当前用户
    const financial = await this.trackFinancialRepo.findOneBy({
      id: data.financialId,
      userId: this.user.userId,
    });
    if (!financial) {
      throw new BadRequestException('基金不存在或无权访问');
    }

    const transaction = this.transactionRepo.create({
      ...data,
      userId: this.user.userId,
    });

    const netValueTrend = await this.financialNetValueService.getFinancialNetValueTrend(
      financial,
      data.ensureDate
    );

    if (netValueTrend) {
      transaction.shares = netValueTrend.getSharesByAmount(transaction.amount);
    }

    return this.transactionRepo.save(transaction);
  }

  /** 删除交易记录 */
  async delete(id: string) {
    // 获取要删除的交易记录
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) {
      throw new BadRequestException('交易记录不存在');
    }

    // 删除交易记录
    const result = await this.transactionRepo.softDelete({ id });
    if (result.affected === 0) {
      throw new BadRequestException('交易记录不存在');
    }

    return true;
  }

  /** 更新交易记录 */
  async update(data: TrackFinancialTransactionUpdateDto) {
    const { id, ...rest } = data;

    // 检查交易记录是否存在且属于当前用户
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) {
      throw new BadRequestException('交易记录不存在');
    }

    const financial = await this.trackFinancialRepo.findOneBy({
      id: transaction.financialId,
      userId: this.user.userId,
    });
    if (!financial) {
      throw new BadRequestException('基金不存在或无权访问');
    }

    const netValueTrend = await this.financialNetValueService.getFinancialNetValueTrend(
      financial,
      data.ensureDate
    );

    if (netValueTrend) {
      rest.shares =
        netValueTrend.type === 'profit'
          ? rest.amount
          : Number((rest.amount / netValueTrend.value).toFixed(6));
    }

    return this.transactionRepo.update(id, rest);
  }

  /** 查询交易记录列表 */
  async list(query: TrackFinancialTransactionQuery) {
    const {
      current = 1,
      pageSize = 10,
      financialId,
      transactionType,
      from,
      to,
      orderBy = 'DESC',
    } = query;
    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .where({ userId: this.user.userId });

    if (pageSize != Infinity) {
      queryBuilder.limit(pageSize).offset((current - 1) * pageSize);
    }

    if (financialId) {
      queryBuilder.andWhere({ financialId: financialId });
    }
    if (transactionType) {
      queryBuilder.andWhere({ transactionType });
    }
    if (from) {
      queryBuilder.andWhere({ ensureDate: MoreThanOrEqual(from) });
    }
    if (to) {
      queryBuilder.andWhere({ ensureDate: LessThanOrEqual(to) });
    }

    queryBuilder.orderBy('transaction.ensureDate', orderBy);

    const transactions = await queryBuilder.getManyAndCount();

    if (!transactions[0].length) {
      return transactions;
    }

    const financials = await this.trackFinancialRepo.find({
      select: ['id', 'name', 'code'],
      where: {
        id: In(batchKeys(transactions[0], 'financialId')),
      },
    });

    mergeEntity(transactions[0], financials, ['financialId', 'financial'], 'id');

    return transactions;
  }

  /** 获取某个时间点理财的总份额 */
  async getFinancialShares(financial: TrackFinancial, date: Date) {
    const [transactions] = await this.list({
      financialId: financial.id,
      to: date,
    });
    return transactions.reduce((shares, transaction) => {
      return shares + Number(transaction.sharesWithSymbol);
    }, 0);
  }

  /** 获取某个时间点理财的总交易额 */
  async getFinancialAmount(financial: TrackFinancial, date: Date) {
    const [transactions] = await this.list({
      financialId: financial.id,
      to: date,
    });
    return transactions.reduce((amount, transaction) => {
      return amount + Number(transaction.value);
    }, 0);
  }

  /** 更新某个时间点下所有交易的份额 */
  async updateTransactionShares(trend: FinancialNetValueTrendEntity) {
    const { date, code } = trend;
    const [[financial]] = await this.trackFinancialRecordService.list({ code });
    if (!financial) {
      return;
    }
    const transactions = await this.transactionRepo.findBy({
      financialId: financial.id,
      ensureDate: date,
    });
    for (const transaction of transactions) {
      transaction.shares = trend.getSharesByAmount(transaction.amount);
      await this.transactionRepo.save(transaction);
    }
  }
}
