/*
 * @author: chenjieLU
 * @description: 基础的增删改查数据库的 service
 */
import type { InsertType, QueryType } from '@l/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/entities';
import type { BaseEntity } from '@/entities';
import { getInFilter } from '@/utils';

export class UserModelService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  getMetaData(user: QueryType<UserEntity> = {}) {
    const { userName } = user;
    return this.userRepository.find({
      where: {
        ...getInFilter('userName', userName),
      },
    });
  }

  save(user: InsertType<UserEntity>) {
    return this.userRepository.save(user);
  }

  delete(id: BaseEntity['id']) {
    return this.userRepository.softDelete({ id });
  }
}
