import { ConfigLoader } from './configuration';
import { type RedisBaseModuleConfig } from '@/infrastructure/redis';

export interface DataBaseConfig {
  mysql: {
    host: string;
    port: number;
    password: string;
  };
  redis: RedisBaseModuleConfig;
}

export const databaseConfig = new ConfigLoader<DataBaseConfig>('db').register();
