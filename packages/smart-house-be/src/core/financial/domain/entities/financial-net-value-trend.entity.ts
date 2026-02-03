import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'financial_net_value_trend', comment: '理财净值表' })
@Index('ux_code_date', ['code', 'date'], { unique: true })
export class FinancialNetValueTrendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, comment: '理财编码' })
  code: string;

  @Column({ type: 'date', comment: '当前净值日期' })
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

  // 将金额转为份数
  getSharesByAmount(amount: number) {
    return Math.abs(this.type === 'profit' ? amount : Number((amount / this.value).toFixed(6)));
  }
}
