import winston from 'winston';
import LokiTransport from 'winston-loki';
import { deepMerge } from '@/shared/toolkits/object';
import { type envConfig, getConfig } from '@/infrastructure/config';
import { ConfigType } from '@nestjs/config';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { stringifyJson } from '@/shared/toolkits/transform';
import { format } from 'node:util';

export const createLogger = (context: string) => {
  return new LokiLogger(() => {
    return getConfig('env', 'logger');
  }, context);
};

export class LokiLogger {
  private _logger: winston.Logger;

  static colorizeLevel(level: string, text: string) {
    switch (level) {
      case 'error':
        return clc.red(text);
      case 'warn':
        return clc.yellow(text);
      case 'debug':
        return clc.magentaBright(text);
      case 'verbose':
        return clc.cyanBright(text);
      default:
        return clc.green(text);
    }
  }

  constructor(
    private readonly loggerConfig:
      | ConfigType<typeof envConfig>['logger']
      | (() => ConfigType<typeof envConfig>['logger']),
    private readonly context?: string
  ) {}

  get logger(): winston.Logger {
    if (this._logger) {
      return this._logger;
    }
    const { context } = this;
    const loggerConfig =
      typeof this.loggerConfig === 'function' ? this.loggerConfig() : this.loggerConfig;
    const transports: winston.transport[] = [];
    if (loggerConfig?.loki) {
      transports.push(
        new LokiTransport(
          deepMerge(loggerConfig.loki, {
            json: true,
            batching: true,
            interval: 5,
            labels: { env: process.env.NODE_ENV || 'dev' },
          })
        )
      );
    }
    if (loggerConfig?.console) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'MM/DD/YYYY, h:mm:ss A',
            }),
            winston.format.printf((data) => {
              const { level, message, timestamp, stack = '' } = data;
              const pid = process.pid;
              const appName = 'Wangdefa';
              const upperLevel = LokiLogger.colorizeLevel(level, level.toUpperCase());

              const prefix = LokiLogger.colorizeLevel(level, `[${appName}] ${pid}  -`);

              const msg =
                typeof message === 'string'
                  ? LokiLogger.colorizeLevel(level, message)
                  : stringifyJson(message, (message as any)?.message ?? '');

              return `${prefix} ${timestamp}     ${upperLevel}${clc.yellow(
                context ? ' [' + context + ']' : ''
              )} ${msg}${LokiLogger.colorizeLevel(level, stack ? '\n' + stack : '')}`;
            })
          ),
        })
      );
    }
    if (transports.length > 0) {
      this._logger = winston.createLogger({
        level: loggerConfig.level,
        format: winston.format.combine(
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
        transports,
      });
    }
    return this._logger;
  }

  info(message: any, ...optionalParams: any[]) {
    this.logger?.info(format(message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger?.error(format(message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger?.warn(format(message, ...optionalParams));
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logger?.debug(format(message, ...optionalParams));
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logger?.verbose(format(message, ...optionalParams));
  }
}
