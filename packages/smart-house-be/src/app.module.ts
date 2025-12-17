import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { FireflyModule } from '@/interface/modules/firefly/firefly.module';
import { configLoad, consulConfig, databaseConfig } from '@/infrastructure/config';
import { ConsulModule, KvService } from '@/infrastructure/consul';
import { ExceptionProvider } from '@/infrastructure/exception';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '@/infrastructure/redis';
import { WechatModule } from '@/interface/modules/wechat/wechat.module';
import { GuardProviders } from '@/infrastructure/guard';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: configLoad,
    }),
    // 缓存模块
    CacheModule.register({
      isGlobal: true,
    }),
    // 远程配置模块
    ConsulModule.forRootAsync({
      isGlobal: true,
      useFactory: (consulCfg: ConfigType<typeof consulConfig>) => ({
        ...consulCfg,
      }),
      inject: [consulConfig.KEY],
    }),
    // redis模块
    RedisModule.forRootAsync({
      isGlobal: true,
      useFactory: async (kvService: KvService, dbConfig: ConfigType<typeof databaseConfig>) => {
        const config = await kvService.get('db');
        return {
          retryStrategy: (times: number) => {
            return Math.min(times * 1000, 10000);
          },
          ...dbConfig.redis,
          ...config.redis,
        };
      },
      inject: [KvService, databaseConfig.KEY],
    }),
    /**
     * 业务代码模块
     */
    FireflyModule,
    WechatModule,
  ],
  providers: [...GuardProviders, ...ExceptionProvider],
})
export class AppModule {}
