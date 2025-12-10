import { ConfigLoader } from './configuration';

export interface DataBaseConfig {
  host: string;
  port: string;
}

export const databaseConfig = new ConfigLoader<DataBaseConfig>('database').register();
