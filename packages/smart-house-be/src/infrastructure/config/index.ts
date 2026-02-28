import { consulConfig } from '@/infrastructure/config/consul.config';
import { databaseConfig } from '@/infrastructure/config/database.config';
import { envConfig } from '@/infrastructure/config/env.config';

export const configLoad = [envConfig, databaseConfig, consulConfig];

export { envConfig, databaseConfig, consulConfig };
export { getConfig } from './configuration';
