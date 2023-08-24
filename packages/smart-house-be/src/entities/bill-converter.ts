import { BillConverterModel } from '@l/shared';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity, forEntityFeature } from './base';
import { UserEntity, BillConvertRuleEntity } from '@/entities';

@Entity({
  name: 'bill_converter',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class BillConverterEntity extends BaseEntity implements BillConverterModel {
  @Column({ type: 'varchar', length: 32, comment: '规则集名称' })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.billConverter)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @OneToMany(() => BillConvertRuleEntity, (billConvertRule) => billConvertRule.converter)
  rules?: BillConvertRuleEntity[];
}

export const BillConverterEntityFeature = forEntityFeature(BillConverterEntity);
