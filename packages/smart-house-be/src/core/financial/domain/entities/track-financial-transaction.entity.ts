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
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';

@Entity({ name: 'track_financial_transaction', comment: '基金交易记录表' })
export class FinancialTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'financial_id', type: 'uuid', comment: '基金Id' })
  financialId: string;

  @Column({ name: 'user_id', type: 'uuid', comment: '用户Id' })
  userId: string;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: FinancialTransactionType,
    comment: '交易类型：BUY-买入，SELL-卖出',
  })
  transactionType: FinancialTransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '交易金额' })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 6,
    comment: '交易份额，确认份额后会更新，年化的类型没有份额',
    default: 0,
  })
  shares: number;

  @Column({
    name: 'ensure_date',
    type: 'datetime',
    comment: '确认份额的时间',
  })
  ensureDate: Date;

  @Column({
    name: 'transaction_date',
    type: 'datetime',
    comment: '交易时间',
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

  @ManyToOne(() => TrackFinancial, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'id' })
  financial: TrackFinancial[];
}
