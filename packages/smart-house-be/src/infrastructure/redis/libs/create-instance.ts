import { createClient, type RedisClientOptions } from 'redis';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import { REDIS_CONFIGURATION_LOADER } from '@/infrastructure/redis/constant';
import { createLogger } from '@/shared/logger';

const logger = createLogger('RedisFactory');

const DEFAULT_MAX_RECONNECT_DELAY_MS = 30000;

const createDefaultReconnectStrategy =
  (maxDelayMs = DEFAULT_MAX_RECONNECT_DELAY_MS) =>
  (retries: number) => {
    // exponential backoff with cap
    return Math.min(2 ** retries * 100, maxDelayMs);
  };

export const createInstance = () => ({
  provide: REDIS_INSTANCE,
  useFactory: async (config: RedisClientOptions) => {
    const client = createClient({
      ...config,
      socket: {
        ...config?.socket,
        reconnectStrategy: config?.socket?.reconnectStrategy ?? createDefaultReconnectStrategy(),
      },
    });

    client.on('error', (err) => {
      logger.error(`Redis client error: ${err?.message ?? err}`);
    });
    client.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });
    client.on('ready', () => {
      logger.info('Redis ready');
    });
    client.on('end', () => {
      logger.warn('Redis connection closed');
    });

    await client.connect();
    return client;
  },
  inject: [REDIS_CONFIGURATION_LOADER],
});
