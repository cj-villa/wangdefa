import { Global, Module } from '@nestjs/common';
import { RedisBaseService } from './redis-base.service';
import { REDIS_BASE_SERVICE, REDIS_CONFIGURATION_TOKEN } from '../constant';

/**
 * publicApi
 */
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CONFIGURATION_TOKEN,
      useFactory: () => ({}),
    },
    { provide: REDIS_BASE_SERVICE, useClass: RedisBaseService },
  ],
  exports: [REDIS_CONFIGURATION_TOKEN, REDIS_BASE_SERVICE],
})
export class RedisOpenModule {}
