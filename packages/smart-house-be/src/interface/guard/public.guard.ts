/**
 * 开放公网校验，仅开放固定的接口，其余全部不返回数据
 */
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { getIp } from '@/shared/toolkits/request';
import { isDev } from '@/shared/toolkits/env';
import { PrivateException } from 'src/interface/exception';

const IS_PUBLIC_KEY = Symbol('isPublic');

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('isPublic', isPublic);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const ip = getIp(request);
    console.log('ip', ip);
    if (isDev || ip === '127.0.0.1' || ip.startsWith('192.168')) {
      return true;
    }
    throw new PrivateException();
  }
}

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
