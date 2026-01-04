import { REDIS_INSTANCE } from '@/infrastructure/redis';
import { createClient, type RedisClientOptions } from 'redis';
import { REDIS_CONFIGURATION_LOADER } from '@/infrastructure/redis/constant';

export const createInstance = () => ({
  provide: REDIS_INSTANCE,
  useFactory: async (config: RedisClientOptions) => {
    return createClient({ ...config })
      .on('error', (err) => {
        console.error('Redis Client Error', err);
        throw new Error('Redis Client Error');
      })
      .connect();
  },
  inject: [REDIS_CONFIGURATION_LOADER],
});
