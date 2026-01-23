import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FundTransactionType } from '@/core/financial/application/enum/fund-transaction-type';
import { TrackFund } from '@/core/financial/domain/entities/track-fund.entity';

@Entity({ name: 'track_fund_transaction', comment: '基金交易记录表' })
export class FundTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fund_id', type: 'uuid', comment: '基金Id' })
  fundId: string;

  @Column({ name: 'user_id', type: 'uuid', comment: '用户ID' })
  userId: string;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: FundTransactionType,
    comment: '交易类型：BUY-买入，SELL-卖出',
  })
  transactionType: FundTransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 0, comment: '交易份额' })
  shares: number;

  @Column({
    name: 'transaction_date',
    type: 'datetime',
    comment: '开始确认份额的时间，默认根据创建时间计算T+1',
  })
  transactionDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    name: 'deleted_at',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date;

  @ManyToOne(() => TrackFund, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'id' })
  fund: TrackFund[];
}
