import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'financial_trend', comment: '正在追踪的基金记录表' })
export class FinancialTrendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, comment: '基金编码' })
  code: string;

  @Column({ type: 'varchar', length: 8, comment: '净值年月，如：202601' })
  date: string;

  @Column({
    type: 'enum',
    enum: ['net', 'profit'],
    comment: '基金类型，net为单位净值，profit为万份收益',
    default: 'net',
  })
  type: 'net' | 'profit';

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月1号的单位净值/万份收益（元）' })
  salePrice01: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月2号的单位净值/万份收益（元）' })
  salePrice02: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月3号的单位净值/万份收益（元）' })
  salePrice03: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月4号的单位净值/万份收益（元）' })
  salePrice04: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月5号的单位净值/万份收益（元）' })
  salePrice05: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月6号的单位净值/万份收益（元）' })
  salePrice06: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月7号的单位净值/万份收益（元）' })
  salePrice07: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月8号的单位净值/万份收益（元）' })
  salePrice08: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, comment: '当月9号的单位净值/万份收益（元）' })
  salePrice09: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月10号的单位净值/万份收益（元）',
  })
  salePrice10: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月11号的单位净值/万份收益（元）',
  })
  salePrice11: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月12号的单位净值/万份收益（元）',
  })
  salePrice12: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月13号的单位净值/万份收益（元）',
  })
  salePrice13: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月14号的单位净值/万份收益（元）',
  })
  salePrice14: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月15号的单位净值/万份收益（元）',
  })
  salePrice15: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月16号的单位净值/万份收益（元）',
  })
  salePrice16: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月17号的单位净值/万份收益（元）',
  })
  salePrice17: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月18号的单位净值/万份收益（元）',
  })
  salePrice18: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月19号的单位净值/万份收益（元）',
  })
  salePrice19: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月20号的单位净值/万份收益（元）',
  })
  salePrice20: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月21号的单位净值/万份收益（元）',
  })
  salePrice21: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月22号的单位净值/万份收益（元）',
  })
  salePrice22: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月23号的单位净值/万份收益（元）',
  })
  salePrice23: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月24号的单位净值/万份收益（元）',
  })
  salePrice24: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月25号的单位净值/万份收益（元）',
  })
  salePrice25: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月26号的单位净值/万份收益（元）',
  })
  salePrice26: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月27号的单位净值/万份收益（元）',
  })
  salePrice27: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月28号的单位净值/万份收益（元）',
  })
  salePrice28: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月29号的单位净值/万份收益（元）',
  })
  salePrice29: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月30号的单位净值/万份收益（元）',
  })
  salePrice30: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    comment: '当月31号的单位净值/万份收益（元）',
  })
  salePrice31: number;
}
