import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Configs } from '@/config';
import { Models } from '@/entities';
import { getImports } from '@/utils';
import { authGuardProvider } from '../guard/auth';
import { roleGuardProvider } from '../guard/role';
import { validationPipe } from '../pipe/validation';

@Module({
  imports: [Configs, Models, ...getImports(__dirname)],
  /**
   * jwt service
   * 登录态校验
   * 权限校验
   * 参数校验
   * 错误拦截
   */
  providers: [JwtService, authGuardProvider, roleGuardProvider, validationPipe],
})
export class AppModule {}
