import type { InsertType, QueryType, UserModel } from '@l/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillConvertRuleEntity } from '@/entities';
import { getInFilter } from '@/utils';

@Injectable()
export class ConvertRuleModelService {
  constructor(
    @InjectRepository(BillConvertRuleEntity)
    private billConvertRule: Repository<BillConvertRuleEntity>
  ) {}

  getMetaData(user: QueryType<UserModel> = {}) {
    const { userId } = user;
    return this.billConvertRule.find({
      where: {
        ...getInFilter('ownerId', userId),
      },
    });
  }

  save(records: Array<InsertType<BillConvertRuleEntity>>) {
    return this.billConvertRule.save(records);
  }
}
