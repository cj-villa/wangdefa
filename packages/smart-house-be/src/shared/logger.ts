import { format } from 'node:util';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { ConfigType } from '@nestjs/config';
import winston from 'winston';
import LokiTransport from 'winston-loki';
import { type envConfig, getConfig } from '@/infrastructure/config';
import { deepMerge } from '@/shared/toolkits/object';
import { stringifyJson } from '@/shared/toolkits/transform';

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
      const lokiTransport = new LokiTransport(
        deepMerge(loggerConfig.loki, {
          json: true,
          batching: true,
          interval: 5,
          labels: { env: process.env.NODE_ENV || 'dev' },
          onConnectionError(error: unknown) {
            console.error('connectionError', error);
          },
        })
      );
      this.bindLokiFeedback(lokiTransport, loggerConfig?.loki?.host || 'unknown');
      transports.push(lokiTransport);
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
                  : stringifyJson(message, (message as { message?: string })?.message ?? '');

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

  private bindLokiFeedback(transport: LokiTransport, lokiHost: string) {
    transport.on('error', (error: unknown) => {
      this.emitLokiFailureFeedback(error, lokiHost);
    });
  }

  private emitLokiFailureFeedback(error: unknown, lokiHost: string) {
    const message =
      error instanceof Error ? error.stack || error.message : stringifyJson(error, '');
    const payload = {
      level: 'error',
      event: 'loki_transport_error',
      lokiHost,
      timestamp: new Date().toISOString(),
      error: message,
      context: this.context || 'LokiLogger',
    };

    console.log(`${JSON.stringify(payload)}\n`);
  }

  info(message: unknown, ...optionalParams: unknown[]) {
    this.logger?.info(format(message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logger?.error(format(message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger?.warn(format(message, ...optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]) {
    this.logger?.debug(format(message, ...optionalParams));
  }

  verbose?(message: unknown, ...optionalParams: unknown[]) {
    this.logger?.verbose(format(message, ...optionalParams));
  }
}
