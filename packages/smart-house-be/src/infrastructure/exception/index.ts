import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from '@/infrastructure/exception/global-exception';

export const ExceptionProvider = [{ provide: APP_FILTER, useClass: GlobalExceptionsFilter }];
