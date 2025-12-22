import { Inject, Injectable } from '@nestjs/common';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import type { RedisClientType } from 'redis';
import * as dayjs from 'dayjs';

@Injectable()
export class SingleAutomationService {
  @Inject(REDIS_INSTANCE)
  private readonly redis: RedisClientType;

  private get HintKey() {
    return `firefly:single:hint:${dayjs().day()}`;
  }

  async storeHint(hint: string) {
    const isNew = !(await this.redis.exists(this.HintKey));
    await this.redis.lPush(this.HintKey, hint);
    if (isNew) {
      // 两天过期
      await this.redis.expire(this.HintKey, 3600 * 48);
    }
  }

  async getCurrentHint() {
    return this.redis.lRange(this.HintKey, 0, -1);
  }
}
