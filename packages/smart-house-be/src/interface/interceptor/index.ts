import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatInterceptor } from './response-format';
import { RequestContextInterceptor } from './request-context';

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
