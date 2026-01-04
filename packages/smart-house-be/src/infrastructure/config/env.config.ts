import { ConfigLoader } from './configuration';
import LokiTransport from 'winston-loki';

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
