import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { RedisClientOptions } from 'redis';
import { ConfigLoader } from './configuration';

export interface DataBaseConfig {
  redis: Omit<RedisClientOptions, 'host' | 'port' | 'password' | 'db'>;
  mysql: Omit<TypeOrmModuleOptions, 'host' | 'port' | 'password' | 'username'>;
  firefly: Omit<TypeOrmModuleOptions, 'host' | 'port' | 'password' | 'username'>;
}

export const databaseConfig = new ConfigLoader<DataBaseConfig>('db').register();
