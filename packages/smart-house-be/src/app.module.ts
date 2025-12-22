import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { FireflyModule } from '@/interface/modules/firefly/firefly.module';
import { configLoad, consulConfig, databaseConfig } from '@/infrastructure/config';
import { ConsulModule, KvService } from '@/infrastructure/consul';
import { ExceptionProvider } from 'src/interface/exception';
import { CacheModule } from '@nestjs/cache-manager';
import { REDIS_INSTANCE, RedisModule } from '@/infrastructure/redis';
import { WechatModule } from '@/interface/modules/wechat/wechat.module';
import { GuardProviders } from 'src/interface/guard';
import { FallbackModule } from '@/interface/modules/fallback/fallback.module';
import { CacheableMemory, Keyv } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { RedisClientType } from 'redis';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: configLoad,
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
          ...dbConfig.redis,
          ...config.redis,
        };
      },
      inject: [KvService, databaseConfig.KEY],
    }),
    // 缓存模块
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (redis: RedisClientType) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(redis),
          ],
        };
      },
      inject: [REDIS_INSTANCE],
    }),
    /**
     * 业务代码模块
     */
    FireflyModule,
    WechatModule,
    FallbackModule,
  ],
  providers: [...GuardProviders, ...ExceptionProvider],
})
export class AppModule {}
