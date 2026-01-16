import type { RedisClientType } from 'redis';
import { isProd } from '@/shared/toolkits/env';

export const checkLock = async (redis: RedisClientType, key: string, ttl = 60) => {
  if (!isProd) {
    return true;
  }
  const lock = await redis.set(`wangdefa:${key}:lock`, '1', {
    condition: 'NX',
    expiration: { type: 'EX', value: ttl },
  });
  return lock === 'OK';
};
