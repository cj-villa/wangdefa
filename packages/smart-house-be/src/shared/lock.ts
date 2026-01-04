import type { RedisClientType } from 'redis';

export const checkLock = async (redis: RedisClientType, key: string, ttl = 60) => {
  const lock = await redis.set(`wangdefa:${key}:lock`, '1', {
    condition: 'NX',
    expiration: { type: 'EX', value: ttl },
  });
  return lock === 'OK';
};
