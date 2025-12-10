import { ConfigLoader } from './configuration';

export interface ConsulConfig {
  host: string;
  token?: string;
}

export const consulConfig = new ConfigLoader<ConsulConfig>('consul').register();
