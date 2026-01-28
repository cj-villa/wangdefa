import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'financial_value_trend', comment: '基金价值表' })
export class FinancialValueTrendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, comment: '基金编码' })
  code: string;

  @Column({ type: 'datetime', precision: 6, comment: '当前净值时间' })
  date: Date;

  @Column({ type: 'decimal', precision: 13, scale: 6, comment: '价值（元）' })
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
