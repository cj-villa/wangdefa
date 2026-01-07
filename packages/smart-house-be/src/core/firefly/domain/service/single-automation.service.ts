import { Inject, Injectable } from '@nestjs/common';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import type { RedisClientType } from 'redis';
import dayjs from 'dayjs';
import { Cron } from '@nestjs/schedule';
import { createLogger } from '@/shared/logger';
import { checkLock } from '@/shared/lock';
import { DIFY_BASE_SERVICE, DifyBaseService } from '@/infrastructure/dify';

import {parseJson} from "@/shared/toolkits/transform";

@Injectable()
export class SingleAutomationService {
  private readonly logger = createLogger(SingleAutomationService.name);

  @Inject(REDIS_INSTANCE)
  private readonly redis: RedisClientType;

  @Inject(DIFY_BASE_SERVICE)
  private readonly difyBaseModule: DifyBaseService;

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

  async getCurrentHint(offset = 0, length?: number) {
    return this.redis.lRange(this.HintKey, offset, length ? offset + length : -1);
  }

  async popHint(length: number) {
    return this.redis.lmPop(this.HintKey, 'LEFT', { COUNT: length });
  }

  // @Cron('*/10 * * * * *')
  @Cron('* * 23 * * *')
  async handleCron() {
    const locked = await checkLock(this.redis, 'SingleAutomationService1', 6);
    if (!locked) {
      return;
    }
    let hints = await this.popHint(5);
    while (Array.isArray(hints) && hints[1].length) {
      console.log(hints[1].join('\n'));
      this.difyBaseModule
        .post('/workflows/run', {
          inputs: {
            order: hints[1].join('\n'),
            address: '10.10.1.86',
          },
          response_mode: 'streaming',
          user: 'system',
        })
        .then((res) => {
          const last = parseJson<Record<string, any>>(
            (res.split('\n').filter(Boolean)?.pop() ?? '').split('data:')[1]?.trim() ?? ''
          );
          const data = parseJson(
            (last?.data?.outputs?.text ?? '').match(/```json([\s\S]*)```/)?.[1]
          );
          console.log('123res', data);
        });
      hints = await this.popHint(5);
    }
    this.logger.debug('Called when the current second is 45');
  }
}
