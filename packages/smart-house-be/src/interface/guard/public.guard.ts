/**
 * 开放公网校验，仅开放固定的接口，其余全部不返回数据
 */
import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { getIp } from '@/shared/toolkits/request';
import { isDev } from '@/shared/toolkits/env';
import { PrivateException } from 'src/interface/exception';
import { InjectLogger, type LokiLogger } from '@/interface/decorate/inject-logger';

const IS_PUBLIC_KEY = Symbol('isPublic');

@Injectable()
export class PublicGuard implements CanActivate {
  @InjectLogger(PublicGuard.name)
  private readonly logger: LokiLogger;

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const ip = getIp(request);
    this.logger.info(`guard ip: ${ip}; method: ${request.method}; path: ${request.path};`);
    if (isPublic) {
      return true;
    }
    if (isDev || ip === '127.0.0.1' || ip.startsWith('192.168')) {
      return true;
    }
    throw new PrivateException();
  }
}

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
