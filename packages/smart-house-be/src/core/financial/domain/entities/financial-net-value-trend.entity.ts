import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'financial_net_value_trend', comment: '理财净值表' })
export class FinancialNetValueTrendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, comment: '理财编码' })
  code: string;

  @Column({ type: 'datetime', precision: 6, comment: '当前净值时间' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ['net', 'profit'],
    comment: '理财类型，net为单位净值，profit为万份收益',
    default: 'net',
  })
  type: 'net' | 'profit';

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '单位净值/万份收益（元）' })
  value: number;

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
