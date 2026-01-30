import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'financial_value_trend', comment: '理财价值表' })
export class FinancialValueTrendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'financial_id', type: 'uuid', comment: '理财Id' })
  financialId: string;

  @Column({ type: 'datetime', precision: 6, comment: '当前净值时间' })
  date: Date;

  @Column({ type: 'decimal', precision: 13, scale: 6, comment: '当前价值（元）' })
  balance: number;

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
