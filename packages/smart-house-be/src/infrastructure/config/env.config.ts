import LokiTransport from 'winston-loki';
import { ConfigLoader } from './configuration';

export interface EnvConfig {
  port?: number;
  mailSwitch?: boolean;
  logger?: {
    level: string;
    loki?: ConstructorParameters<typeof LokiTransport>[0];
    console?: boolean;
  };
}

export const envConfig = new ConfigLoader<EnvConfig>('env').register();
