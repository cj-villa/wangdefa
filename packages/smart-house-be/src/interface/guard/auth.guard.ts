/**
 * 登录鉴权
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import { Reflector } from '@nestjs/core';
import { getIp } from '@/shared/toolkits/request';
import { InjectLogger, type LokiLogger } from '@/interface/decorate/inject-logger';
import { JwtService } from '@nestjs/jwt';
import { TokenSearchService } from '@/core/token';
import { JwtUser } from '@/core/user';

const IS_NO_AUTH_KEY = Symbol('isNoAuth');

@Injectable()
export class AuthGuard implements CanActivate {
  @InjectLogger(AuthGuard.name)
  private readonly logger: LokiLogger;

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private tokenSearchService: TokenSearchService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuth = this.reflector.getAllAndOverride<boolean>(IS_NO_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noAuth) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const { type, token } = this.extractTokenFromHeader(request) ?? {};
    if (type === 'Bearer') {
      await this.authByAuthorization(request, token);
    } else {
      await this.authByAccessToken(request, token);
    }

    return true;
  }

  // 通过 jwt 进行鉴权
  private async authByAuthorization(request: Request, token: string) {
    if (!token) {
      this.throwException(request, token);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      this.throwException(request, token);
    }
  }

  // 通过系统的 accessToken 进行鉴权
  private async authByAccessToken(request: Request, token: string) {
    const userInfo = await this.tokenSearchService.getUserByToken(token);
    if (!userInfo) {
      this.throwException(request, token);
    }
    const jwtUser: JwtUser = {
      userId: userInfo.userId,
      nickName: userInfo.nickName,
      username: userInfo.username,
      email: userInfo.email,
    };
    request['user'] = jwtUser;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer') {
      return { type, token };
    }
    const accessToken = request.headers['x-access-token'] as string;
    if (accessToken) {
      return {
        token: accessToken,
        type: 'accessToken'
      };    }
  }

  private throwException(request: Request, token: string = '') {
    const ip = getIp(request);
    this.logger.info(
      `auth check failed ip: ${ip}; method: ${request.method}; path: ${request.path}; token: ${token}`
    );
    throw new UnauthorizedException('token校验失败');
  }
}

export const NoAuth = () => SetMetadata(IS_NO_AUTH_KEY, true);
