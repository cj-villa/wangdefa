import { ConfigLoader } from './configuration';
import { RedisClientOptions } from 'redis';

export interface DataBaseConfig {
  redis: Omit<RedisClientOptions, 'host' | 'port' | 'password' | 'db'>;
}

export const databaseConfig = new ConfigLoader<DataBaseConfig>('db').register();
