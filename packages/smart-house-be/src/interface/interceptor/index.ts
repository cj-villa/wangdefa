import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestContextInterceptor } from './request-context';
import { ResponseFormatInterceptor } from './response-format';

export const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseFormatInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: RequestContextInterceptor,
  },
];
