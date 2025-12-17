import { ConfigLoader } from './configuration';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';

export interface DataBaseConfig {
  redis: Omit<RedisOptions, 'host' | 'port' | 'password' | 'db'>;
}

export const databaseConfig = new ConfigLoader<DataBaseConfig>('db').register();
