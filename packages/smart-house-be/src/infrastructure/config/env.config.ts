import { ConfigLoader } from './configuration';

export interface EnvConfig {
  port?: number;
}

export const envConfig = new ConfigLoader<EnvConfig>('env').register();
