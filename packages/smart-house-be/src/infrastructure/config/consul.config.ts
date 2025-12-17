import { ConfigLoader } from './configuration';
import { type ConsulKvModuleConfig } from '@/infrastructure/consul';

export interface ConsulConfig extends ConsulKvModuleConfig {}

export const consulConfig = new ConfigLoader<ConsulConfig>('consul').register();
