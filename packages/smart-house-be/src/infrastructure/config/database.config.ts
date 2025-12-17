import { ConfigLoader } from './configuration';

export interface DataBaseConfig {}

export const databaseConfig = new ConfigLoader<DataBaseConfig>('db').register();
