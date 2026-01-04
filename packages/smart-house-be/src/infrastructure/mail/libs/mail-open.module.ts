import { Global, Module } from '@nestjs/common';
import { MAIL_CONFIGURATION_TOKEN } from '../constant';

/**
 * publicApi
 */
@Global()
@Module({
  providers: [
    {
      provide: MAIL_CONFIGURATION_TOKEN,
      useFactory: () => ({}),
    },
  ],
  exports: [MAIL_CONFIGURATION_TOKEN],
})
export class MailOpenModule {}
