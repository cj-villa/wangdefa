import { createLogger, LokiLogger } from '@/shared/logger';

export const InjectLogger = (context: string = 'Wangdefa') => {
  let logger: LokiLogger;
  return (target: Object, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get: () => {
        if (logger) {
          return logger;
        }
        logger = createLogger(context);
        return logger;
      },
      enumerable: true,
      configurable: true,
    });
  };
};

export { type LokiLogger } from '@/shared/logger';
