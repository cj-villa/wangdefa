/** 资金交易记录服务 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TrackFinancialTransactionCreateDto } from '@/core/financial/application/dto/track-financial-transaction-create.dto';
import { TrackFinancialTransactionUpdateDto } from '@/core/financial/application/dto/track-financial-transaction-update.dto';
import { TrackFinancialTransactionQuery } from '@/core/financial/application/query/track-financial-transaction.query';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { FinancialNetValueService } from '@/core/financial/domain/service/financial-net-value.serivce';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';
import { JwtUser } from '@/core/user';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { batchKeys, mergeEntity } from '@/shared/toolkits/sql';

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

  private normalizeFee(rawFee: unknown): number {
    const fee = Number(rawFee ?? 0);
    if (!Number.isFinite(fee) || fee < 0) {
      return 0;
    }
    return fee;
  }

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

    const fee = this.normalizeFee(data.fee);
    const transaction = this.transactionRepo.create({
      ...data,
      amount: Number(data.amount),
      fee,
      transactionDate: new Date(data.transactionDate),
      ensureDate: new Date(data.ensureDate),
      userId: this.user.userId,
    });

    const netValueTrend = await this.financialNetValueService.getFinancialNetValueTrend(
      financial,
      dayjs(transaction.ensureDate).subtract(financial.delay, 'days').toDate()
    );

    if (netValueTrend) {
      transaction.shares = netValueTrend.getSharesByAmount(financial, transaction.effectiveAmount);
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

    // 避免修改Id
    delete transaction.id;
    const financial = await this.trackFinancialRepo.findOneBy({
      id: transaction.financialId,
      userId: this.user.userId,
    });
    if (!financial) {
      throw new BadRequestException('基金不存在或无权访问');
    }

    if (rest.financialId !== undefined) {
      transaction.financialId = rest.financialId;
    }
    if (rest.transactionType !== undefined) {
      transaction.transactionType = rest.transactionType;
    }
    if (rest.amount !== undefined) {
      transaction.amount = Number(rest.amount);
    }
    if (rest.fee !== undefined) {
      transaction.fee = this.normalizeFee(rest.fee);
    }
    if (rest.shares !== undefined) {
      transaction.shares = Number(rest.shares);
    }
    if (rest.transactionDate !== undefined) {
      transaction.transactionDate = new Date(rest.transactionDate);
    }
    if (rest.ensureDate !== undefined) {
      transaction.ensureDate = new Date(rest.ensureDate);
    }

    const netValueTrend = await this.financialNetValueService.getFinancialNetValueTrend(
      financial,
      dayjs(transaction.ensureDate ?? transaction.ensureDate)
        .subtract(financial.delay, 'days')
        .toDate()
    );

    if (netValueTrend) {
      transaction.shares = netValueTrend.getSharesByAmount(financial, transaction.effectiveAmount);
    }

    return this.transactionRepo.update(id, transaction);
  }

  /** 查询交易记录列表 */
  async list(query: TrackFinancialTransactionQuery, userId?: string) {
    const {
      current = 1,
      pageSize = 10,
      financialId,
      name,
      code,
      transactionType,
      from,
      to,
      orderBy = 'DESC',
    } = query;
    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .where({ userId: userId ?? this.user.userId });

    if (pageSize != Infinity) {
      queryBuilder.limit(pageSize).offset((current - 1) * pageSize);
    }

    if (financialId) {
      queryBuilder.andWhere({ financialId: financialId });
    }

    if (name || code) {
      queryBuilder.innerJoin(TrackFinancial, 'financial', 'financial.id = transaction.financialId');
    }

    if (name) {
      queryBuilder.andWhere('financial.name LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      queryBuilder.andWhere('financial.code LIKE :code', { code: `%${code}%` });
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
    const [transactions] = await this.list(
      {
        financialId: financial.id,
        to: date,
      },
      financial.userId
    );
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
      return amount + transaction.value;
      // return amount + transaction.value + transaction.effectiveAmount;
    }, 0);
  }

  async getFinancialTotalFee(financial: TrackFinancial, date: Date) {
    const [transactions] = await this.list({
      financialId: financial.id,
      to: date,
    });
    return transactions.reduce(
      (total, transaction) => total + this.normalizeFee((transaction as { fee?: unknown }).fee),
      0
    );
  }

  /** 更新某个时间点下所有交易的份额 */
  async updateTransactionShares(netValueTrend: FinancialNetValueTrendEntity) {
    const { date, code } = netValueTrend;
    const [[financial]] = await this.trackFinancialRecordService.list({ code });
    if (!financial) {
      return;
    }
    const transactions = await this.transactionRepo.findBy({
      financialId: financial.id,
      ensureDate: dayjs(date).subtract(financial.delay).toDate(),
    });
    for (const transaction of transactions) {
      transaction.shares = netValueTrend.getSharesByAmount(financial, transaction.effectiveAmount);
      await this.transactionRepo.save(transaction);
    }
  }
}
