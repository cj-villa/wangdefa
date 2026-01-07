import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>) {
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
