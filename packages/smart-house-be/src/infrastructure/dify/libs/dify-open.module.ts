import { Global, Module } from '@nestjs/common';
import { DifyBaseService } from './dify-base.service';
import { DIFY_BASE_SERVICE, DIFY_CONFIGURATION_TOKEN } from '../constant';

/**
 * publicApi
 */
@Global()
@Module({
  providers: [
    {
      provide: DIFY_CONFIGURATION_TOKEN,
      useFactory: () => ({}),
    },
    { provide: DIFY_BASE_SERVICE, useClass: DifyBaseService },
  ],
  exports: [DIFY_CONFIGURATION_TOKEN, DIFY_BASE_SERVICE],
})
export class DifyOpenModule {}
