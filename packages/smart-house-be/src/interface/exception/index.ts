import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from '@/interface/exception/global-exception';
import { PrivateExceptionsFilter } from '@/interface/exception/private-exception';

export const ExceptionProvider = [
  { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
  { provide: APP_FILTER, useClass: PrivateExceptionsFilter },
];

export { PrivateException } from './private-exception';
