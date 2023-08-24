/**
 * @description: 校验接口权限
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles) {
      return true;
    }
    return true;
  }
}

export const roleGuardProvider = {
  provide: APP_GUARD,
  useClass: RoleGuard,
};
