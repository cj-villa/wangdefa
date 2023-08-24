import { BaseModel } from '@l/shared';
import { DynamicModule } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesMetadataStorage } from '@nestjs/typeorm/dist/entities-metadata.storage';
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants';
import {
  CreateDateColumn,
  DataSource,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity implements BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '修改时间' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', comment: '删除时间' })
  deletedAt: Date;
}

const getProvider = (entity: EntityClassOrSchema) => ({
  provide: getRepositoryToken(entity, DEFAULT_DATA_SOURCE_NAME),
  useFactory: (dataSource: DataSource) => {
    return new Proxy(
      {},
      {
        get(_, prop) {
          return dataSource.getRepository(entity)[prop];
        },
      }
    );
  },
  inject: [getDataSourceToken(DEFAULT_DATA_SOURCE_NAME)],
});

/** 重新实现方法，proxy provider，从而在使用时再去获取dataSource，从而兼容 Transactional */
export const forEntityFeature = (entity: EntityClassOrSchema): DynamicModule => {
  const provider = getProvider(entity);
  EntitiesMetadataStorage.addEntitiesByDataSource(DEFAULT_DATA_SOURCE_NAME, [entity]);
  return {
    module: TypeOrmModule,
    providers: [provider],
    exports: [provider],
  };
};
