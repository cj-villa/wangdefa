import { ConfigLoader } from './configuration';
import { RedisClientOptions } from 'redis';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export interface DataBaseConfig {
  redis: Omit<RedisClientOptions, 'host' | 'port' | 'password' | 'db'>;
  mysql: Omit<TypeOrmModuleOptions, 'host' | 'port' | 'password' | 'username'>;
  firefly: Omit<TypeOrmModuleOptions, 'host' | 'port' | 'password' | 'username'>;
}

export const databaseConfig = new ConfigLoader<DataBaseConfig>('db').register();
