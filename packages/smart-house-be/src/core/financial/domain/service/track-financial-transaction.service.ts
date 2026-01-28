/** 资金交易记录服务 */
import { BadRequestException, Injectable } from '@nestjs/common';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { TrackFinancialTransactionCreateDto } from '@/core/financial/application/dto/track-financial-transaction-create.dto';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import { TrackFinancialTransactionUpdateDto } from '@/core/financial/application/dto/track-financial-transaction-update.dto';
import { TrackFinancialTransactionQuery } from '@/core/financial/application/query/track-financial-transaction.query';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { batchKeys, mergeEntity } from '@/shared/toolkits/sql';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import dayjs from 'dayjs';

@Injectable()
export class TrackFinancialTransactionService {
  @InjectRepository(FinancialTransaction)
  private readonly transactionRepo: Repository<FinancialTransaction>;

  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

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

    // 计算当前总份额
    const previousRestShares = await this.calculatePreviousRestShares(
      data.financialId,
      data.transactionDate
    );
    const newRestShares = this.calculateNewRestShares(
      previousRestShares,
      data.shares,
      data.transactionType
    );

    const transaction = this.transactionRepo.create({
      ...data,
      currentShares: newRestShares,
      userId: this.user.userId,
    });

    const savedTransaction = await this.transactionRepo.save(transaction);

    // 更新后续交易的总份额
    await this.updateSubsequentRestSharess(
      data.financialId,
      dayjs(data.transactionDate).toDate(),
      data.shares,
      data.transactionType
    );

    return savedTransaction;
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

    // 重新计算后续交易的总份额
    await this.recalculateRestSharessFromDate(transaction.financialId, transaction.transactionDate);

    return result;
  }

  /** 更新交易记录 */
  async update(data: TrackFinancialTransactionUpdateDto) {
    const { id, transactionDate, ...rest } = data;

    // 检查交易记录是否存在且属于当前用户
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) {
      throw new BadRequestException('交易记录不存在');
    }

    // 记录旧的交易信息用于重新计算
    const oldTransactionDate = transaction.transactionDate;
    const oldShares = transaction.shares;
    const oldTransactionType = transaction.transactionType;

    // 转换字符串数值为数字类型
    const updateData: Partial<FinancialTransaction> = {
      ...rest,
    };
    if (transactionDate) {
      updateData.transactionDate = new Date(transactionDate);
    }

    // 如果份额或交易类型发生变化，需要重新计算总份额
    if (rest.shares !== undefined || rest.transactionType !== undefined) {
      // 先删除旧交易的影响
      await this.recalculateRestSharessFromDate(transaction.financialId, oldTransactionDate);

      // 应用新交易
      const newTransactionDate = transactionDate ? new Date(transactionDate) : oldTransactionDate;
      const newShares = rest.shares !== undefined ? rest.shares : oldShares;
      const newTransactionType = rest.transactionType || oldTransactionType;

      // 计算新交易后的总份额
      const previousRestShares = await this.calculatePreviousRestShares(
        transaction.financialId,
        newTransactionDate
      );
      const newRestShares = this.calculateNewRestShares(
        previousRestShares,
        newShares,
        newTransactionType
      );

      updateData.currentShares = newRestShares;

      // 更新后续交易的总份额
      await this.updateSubsequentRestSharess(
        transaction.financialId,
        dayjs(newTransactionDate).toDate(),
        newShares,
        newTransactionType
      );
    }

    return this.transactionRepo.update(id, updateData);
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
      .limit(pageSize)
      .offset((current - 1) * pageSize)
      .where({ userId: this.user.userId });

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

  /** 根据ID查询某个日期前的份额余额 */
  async getFinancialRestShares(id: string, transactionDate?: Date) {
    const transaction = await this.transactionRepo.findOne({
      where: { financialId: id, transactionDate: LessThanOrEqual(transactionDate || new Date()) },
      order: { transactionDate: 'DESC' },
    });
    if (!transaction) {
      throw new BadRequestException('交易记录不存在');
    }
    return transaction.currentShares;
  }

  /**
   * 计算指定日期之前的最后总份额
   */
  private async calculatePreviousRestShares(
    financialId: string,
    transactionDate: Date
  ): Promise<number> {
    const previousTransaction = await this.transactionRepo.findOne({
      where: {
        financialId: financialId,
        transactionDate: LessThanOrEqual(transactionDate),
      },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });

    return previousTransaction ? Number(previousTransaction.currentShares) : 0;
  }

  /**
   * 计算新交易后的总份额
   */
  private calculateNewRestShares(
    previousRestShares: number,
    shares: number,
    transactionType: FinancialTransactionType
  ): number {
    if (transactionType === FinancialTransactionType.BUY) {
      return previousRestShares + Number(shares);
    } else if (transactionType === FinancialTransactionType.SELL) {
      const newRestShares = previousRestShares - Number(shares);
      // 年化的那种不太好算，先不考虑卖出的份额超了
      // if (newRestShares < 0) {
      //   throw new BadRequestException('卖出份额不能超过当前总份额');
      // }
      return newRestShares;
    }
    return previousRestShares;
  }

  /**
   * 更新后续交易的总份额
   */
  private async updateSubsequentRestSharess(
    financialId: string,
    transactionDate: Date,
    shares: number,
    transactionType: FinancialTransactionType
  ): Promise<void> {
    const subsequentTransactions = await this.transactionRepo.find({
      where: {
        financialId: financialId,
        transactionDate: MoreThanOrEqual(transactionDate),
      },
      order: { transactionDate: 'ASC', createdAt: 'ASC' },
    });

    // 跳过当前交易（它已经在创建时设置了正确的balance）
    const transactionsToUpdate = subsequentTransactions.filter(
      (t, index) => index > 0 || t.transactionDate.getTime() !== transactionDate.getTime()
    );

    let currentRestShares = await this.calculatePreviousRestShares(financialId, transactionDate);

    // 应用当前交易的影响
    currentRestShares = this.calculateNewRestShares(currentRestShares, shares, transactionType);

    // 更新后续交易的总份额
    for (const transaction of transactionsToUpdate) {
      currentRestShares = this.calculateNewRestShares(
        currentRestShares,
        transaction.shares,
        transaction.transactionType
      );

      await this.transactionRepo.update(transaction.id, { currentShares: currentRestShares });
    }
  }

  /**
   * 从指定日期开始重新计算所有交易的总份额
   */
  private async recalculateRestSharessFromDate(financialId: string, fromDate: Date): Promise<void> {
    const transactions = await this.transactionRepo.find({
      where: {
        financialId: financialId,
        transactionDate: MoreThanOrEqual(fromDate),
      },
      order: { transactionDate: 'ASC', createdAt: 'ASC' },
    });

    if (transactions.length === 0) return;

    // 计算fromDate之前的最后总份额
    let currentRestShares = await this.calculatePreviousRestShares(financialId, fromDate);

    // 重新计算从fromDate开始的所有交易的总份额
    for (const transaction of transactions) {
      currentRestShares = this.calculateNewRestShares(
        currentRestShares,
        transaction.shares,
        transaction.transactionType
      );

      await this.transactionRepo.update(transaction.id, { currentShares: currentRestShares });
    }
  }
}
