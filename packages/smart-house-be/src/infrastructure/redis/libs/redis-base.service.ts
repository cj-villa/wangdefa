import { Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisBaseService {
  constructor() {}

  private _redis: RedisClientType;

  register(redis: RedisClientType) {
    this._redis = redis;
  }

  get redis() {
    return this._redis;
  }
}
