/** 注入需要全局拿到的 request 的对象 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtUser } from '@/core/user';

export interface RequestStore {
  user?: JwtUser;
}

export const requestContext = new AsyncLocalStorage<RequestStore>();

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    return new Observable((subscriber) => {
      requestContext.run({ user: req.user }, () => {
        next.handle().subscribe(subscriber);
      });
    });
  }
}
