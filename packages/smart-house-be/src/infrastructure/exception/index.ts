import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from '@/infrastructure/exception/global-exception';
import { PrivateExceptionsFilter } from '@/infrastructure/exception/private-exception';

export const ExceptionProvider = [
  { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
  { provide: APP_FILTER, useClass: PrivateExceptionsFilter },
];

export { PrivateException } from './private-exception';
