import { BillSourceEnum, BillSourceModel } from '@l/shared';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, forEntityFeature } from './base';
import { UserEntity } from '@/entities';

@Entity({
  name: 'bill_source',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class BillSourceEntity extends BaseEntity implements BillSourceModel {
  @Column({ type: 'varchar', length: 128, comment: '交易订单号', name: 'order_no' })
  orderNo: string;

  @Index('seller_order_no_idx')
  @Column({ type: 'varchar', length: 128, comment: '商家订单号', name: 'seller_order_no' })
  sellerOrderNo: string;

  @Column({ type: 'json', comment: '账单具体内容', name: 'record_detail' })
  recordDetail: Record<string, string | number>;

  @Column({ type: 'enum', enum: BillSourceEnum, comment: '账单来源' })
  source: BillSourceEnum;

  @ManyToOne(() => UserEntity, (user) => user.billSource)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;
}

export const BillSourceEntityFeature = forEntityFeature(BillSourceEntity);
