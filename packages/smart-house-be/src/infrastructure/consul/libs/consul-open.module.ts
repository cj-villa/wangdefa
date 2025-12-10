import { Global, Module } from '@nestjs/common';
import { ConsulBaseService } from './consul-base.service';
import { CONSUL_BASE_SERVICE, CONSUL_CONFIGURATION_TOKEN } from '@/infrastructure/consul/constant';

/**
 * publicApi
 */
@Global()
@Module({
  providers: [
    {
      provide: CONSUL_CONFIGURATION_TOKEN,
      useFactory: () => ({}),
    },
    { provide: CONSUL_BASE_SERVICE, useClass: ConsulBaseService },
  ],
  exports: [CONSUL_CONFIGURATION_TOKEN, CONSUL_BASE_SERVICE],
})
export class ConsulOpenModule {}
