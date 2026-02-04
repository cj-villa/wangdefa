import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { type TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { FinancialType } from '@/core/financial/application/enum/financial-type';

@Entity({ name: 'financial_net_value_trend', comment: '理财净值表' })
@Index('ux_code_date', ['code', 'date'], { unique: true })
export class FinancialNetValueTrendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, comment: '理财编码' })
  code: string;

  @Column({ type: 'date', comment: '当前净值日期' })
  date: Date;

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
  getSharesByAmount(financial: TrackFinancial, amount: number) {
    return Math.abs(
      financial.type === FinancialType.PROFIT ? amount : Number((amount / this.value).toFixed(6))
    );
  }
}
