import { UserModel } from '@l/shared';
import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity, forEntityFeature } from './base';
import { BillSourceEntity, BillConverterEntity, BillConvertRuleEntity } from '@/entities';

@Entity({
  name: 'user',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserEntity extends BaseEntity implements UserModel {
  @Index('user_name_idx')
  @Column({ name: 'user_name', type: 'varchar', length: 32, comment: '用户名', unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 128, comment: '密码' })
  password: string;

  @OneToMany(() => BillSourceEntity, (billSources) => billSources.owner)
  billSource?: BillSourceEntity[];

  @OneToMany(() => BillConverterEntity, (billConverter) => billConverter.owner)
  billConverter?: BillConverterEntity[];

  @OneToMany(() => BillConvertRuleEntity, (billConvertRule) => billConvertRule.owner)
  billConvertRule?: BillConvertRuleEntity[];
}

export const UserEntityFeature = forEntityFeature(UserEntity);
