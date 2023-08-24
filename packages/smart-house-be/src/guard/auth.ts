/**
 * @description: 校验用户是否登录
 */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthSwitch } from '@/constant/reflect';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const methodUnAuth = this.reflector.get<string[]>(AuthSwitch, ctx.getHandler());
    if (methodUnAuth) {
      return true;
    }
    const classUnAuth = this.reflector.get<string[]>(AuthSwitch, ctx.getClass());
    if (classUnAuth) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    try {
      const { secret } = this.configService.get('auth');
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      req.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const authGuardProvider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};
