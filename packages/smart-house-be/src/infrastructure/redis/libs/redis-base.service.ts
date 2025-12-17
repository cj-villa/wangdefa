import { Injectable } from '@nestjs/common';
import IoRedis from 'ioredis';

@Injectable()
export class RedisBaseService {
  constructor() {}

  private _redis: IoRedis;

  register(redis: IoRedis) {
    this._redis = redis;
  }

  get redis() {
    return this._redis;
  }
}
