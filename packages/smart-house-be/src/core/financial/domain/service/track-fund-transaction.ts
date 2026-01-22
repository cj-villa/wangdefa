import { BadRequestException, Injectable } from '@nestjs/common';
import { FundTransaction } from '@/core/financial/domain/entities/track-fund-transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackFundTransactionCreateDto } from '@/core/financial/application/dto/track-fund-transaction-create.dto';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import { TrackFundTransactionUpdateDto } from '@/core/financial/application/dto/track-fund-transaction-update.dto';
import { TrackFundTransactionQuery } from '@/core/financial/application/query/track-fund-transaction.query';

@Injectable()
export class TrackFundTransactionService {
  @InjectRepository(FundTransaction)
  private readonly transactionRepo: Repository<FundTransaction>;

  @InjectRequest('user')
  private user: JwtUser;

  /** 创建交易记录 */
  async create(data: TrackFundTransactionCreateDto) {
    const transaction = this.transactionRepo.create({
      ...data,
      userId: this.user.userId,
    });
    return this.transactionRepo.save(transaction);
  }

  /** 删除交易记录 */
  async delete(id: string) {
    const result = await this.transactionRepo.softDelete({ id, userId: this.user.userId });
    if (result.affected === 0) {
      throw new BadRequestException('交易记录不存在');
    }
    return result;
  }

  /** 更新交易记录 */
  async update(data: TrackFundTransactionUpdateDto) {
    const { id, transactionDate, ...rest } = data;

    // 检查交易记录是否存在且属于当前用户
    const transaction = await this.transactionRepo.findOneBy({ id, userId: this.user.userId });
    if (!transaction) {
      throw new BadRequestException('交易记录不存在');
    }

    // 转换字符串数值为数字类型
    const updateData: Partial<FundTransaction> = {
      ...rest,
    };
    if (transactionDate) {
      updateData.transactionDate = new Date(transactionDate);
    }

    return this.transactionRepo.update(id, updateData);
  }

  /** 查询交易记录列表 */
  async list(query: TrackFundTransactionQuery) {
    const { current = 1, pageSize = 10, fundId, transactionType } = query;
    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .limit(pageSize)
      .offset((current - 1) * pageSize)
      .where({ userId: this.user.userId });

    if (fundId) {
      queryBuilder.andWhere({ fundId });
    }
    if (transactionType) {
      queryBuilder.andWhere({ transactionType });
    }

    // 按交易日期倒序排列
    queryBuilder.orderBy('transaction.transactionDate', 'DESC');

    return queryBuilder.getManyAndCount();
  }

  /** 根据ID查询交易记录 */
  async findById(id: string) {
    const transaction = await this.transactionRepo.findOneBy({ id, userId: this.user.userId });
    if (!transaction) {
      throw new BadRequestException('交易记录不存在');
    }
    return transaction;
  }
}