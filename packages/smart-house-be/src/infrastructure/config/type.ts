import type { EnvConfig } from '@/infrastructure/config/env.config';
import { ConsulConfig } from '@/infrastructure/config/consul.config';
import { DataBaseConfig } from '@/infrastructure/config/database.config';

export interface GlobalConfig {
  env: EnvConfig;
  consul: ConsulConfig;
  db: DataBaseConfig;
}
