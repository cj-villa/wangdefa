import { envConfig } from '@/infrastructure/config/env.config';
import { databaseConfig } from '@/infrastructure/config/database.config';
import { consulConfig } from '@/infrastructure/config/consul.config';

export const configLoad = [envConfig, databaseConfig, consulConfig];
