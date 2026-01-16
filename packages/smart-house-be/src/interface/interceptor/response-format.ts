import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { map } from 'rxjs';
import { Reflector } from '@nestjs/core';

const SKIP_FORMAT = Symbol('SKIP_FORMAT');

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>) {
    const skipLog = this.reflector.getAllAndOverride<boolean>(SKIP_FORMAT, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipLog) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) =>
        typeof data === 'object' && 'code' in data
          ? data
          : {
              code: 0,
              data,
            }
      )
    );
  }
}

@Injectable()
export class PaginationFormatInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>) {
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data) && data.length === 2
            ? { data: data[0], total: data[1], success: true }
            : data
        )
      );
  }
}

export const SkipFormat = () => SetMetadata(SKIP_FORMAT, true);
