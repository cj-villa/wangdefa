import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { FinancialChannel } from '@/core/financial/application/enum/financial-channel';

@Entity({ name: 'track_financial', comment: '正在追踪的基金记录表' })
@Index('ux_code_user_id', ['code', 'userId'], { unique: true })
export class TrackFinancial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, comment: '基金的名称' })
  name: string;

  @Column({ type: 'varchar', length: 32, comment: '基金编码' })
  code: string;

  @Column({ type: 'enum', enum: FinancialChannel, comment: '基金的购买渠道' })
  channel: FinancialChannel;

  @Column({ name: 'user_id', type: 'uuid', comment: '绑定的用户' })
  userId: string;

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

  @OneToMany(() => FinancialTransaction, (transaction) => transaction.financial, {
    createForeignKeyConstraints: false,
  })
  transactions: FinancialTransaction[];
}
