import { Global, Module } from '@nestjs/common';
import { AutoGlobalBaseService } from './auto-global-base.service';
import { AUTO_GLOBAL_BASE_SERVICE, AUTO_GLOBAL_CONFIGURATION_TOKEN } from '../constant';

/**
 * publicApi
 */
@Global()
@Module({
  providers: [
    {
      provide: AUTO_GLOBAL_CONFIGURATION_TOKEN,
      useFactory: () => ({}),
    },
    { provide: AUTO_GLOBAL_BASE_SERVICE, useClass: AutoGlobalBaseService },
  ],
  exports: [AUTO_GLOBAL_CONFIGURATION_TOKEN, AUTO_GLOBAL_BASE_SERVICE],
})
export class AutoGlobalOpenModule {}
