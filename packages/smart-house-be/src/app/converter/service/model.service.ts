import type { InsertType, QueryType } from '@l/shared';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UserContext } from '@/app/context/service';
import { BillConverterEntity, UserEntity } from '@/entities';
import { getInFilter } from '@/utils';

@Injectable()
export class ConverterModelService {
  constructor(
    @InjectRepository(BillConverterEntity) private billConverter: Repository<BillConverterEntity>,
    @Inject(UserContext) private userContext: UserContext
  ) {}

  async getMetaData(user: QueryType<UserEntity> = {}) {
    const { userId } = user;
    const converter = await this.billConverter.find({
      where: {
        ...getInFilter('owner', { id: userId }),
      },
    });
    return converter;
  }

  save(record: InsertType<BillConverterEntity, 'owner'>) {
    return this.billConverter.save({
      ...record,
      owner: this.userContext.user,
    });
  }
}
