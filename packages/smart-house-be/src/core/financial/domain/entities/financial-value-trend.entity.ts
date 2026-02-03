import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'financial_value_trend', comment: '理财价值表' })
@Index('ux_financial_id_date', ['financialId', 'date'], { unique: true })
export class FinancialValueTrendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'financial_id', type: 'uuid', comment: '理财Id' })
  financialId: string;

  @Column({ type: 'date', comment: '当前净值日期' })
  date: Date;

  @Column({ type: 'decimal', precision: 13, scale: 6, comment: '当前价值（元）' })
  balance: number;

  @Column({ type: 'decimal', precision: 13, scale: 6, comment: '当前份额' })
  shares: number;

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
}
