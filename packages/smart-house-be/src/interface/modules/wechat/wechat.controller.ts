import { Body, Controller, Inject, Post } from '@nestjs/common';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import Redis from 'ioredis';
import { Public } from 'src/interface/guard';

@Controller('/api/open/wechat')
export class WechatController {
  @Inject(REDIS_INSTANCE)
  private readonly redis: Redis;

  @Public()
  @Post('/auth')
  auth(@Body() body) {
    const now = new Date();
    const key = `firefly.task.${now.getDay()}`;
    return this.redis.lpush(key, JSON.stringify(body));
  }
}
