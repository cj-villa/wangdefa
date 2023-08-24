import {
  BillConvertRuleModel,
  BillConvertRuleAction,
  BillSourceEnum,
  BillConvertRuleOperator,
} from '@l/shared';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, forEntityFeature } from './base';
import { UserEntity, BillConverterEntity } from '@/entities';

@Entity({
  name: 'bill_convert_rule',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class BillConvertRuleEntity extends BaseEntity implements BillConvertRuleModel {
  @Column({ type: 'enum', enum: BillSourceEnum, comment: '适用的账单类型', default: null })
  billSource?: BillSourceEnum;

  @Column({ type: 'enum', enum: BillConvertRuleAction, comment: '判断规则' })
  action: BillConvertRuleAction;

  @Column({ type: 'varchar', length: 64, comment: '判断的字段' })
  source: string;

  @Column({ type: 'enum', enum: BillConvertRuleOperator, comment: '判断操作符' })
  operator: BillConvertRuleOperator;

  @Column({ type: 'varchar', length: 256, comment: '判断的内容' })
  right: string;

  @ManyToOne(() => UserEntity, (user) => user.billConvertRule)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @ManyToOne(() => BillConverterEntity, (billConverter) => billConverter.rules)
  @JoinColumn({ name: 'converter_id' })
  converter: BillConverterEntity;
}

export const BillConvertRuleEntityFeature = forEntityFeature(BillConvertRuleEntity);
