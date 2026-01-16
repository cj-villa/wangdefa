import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { FireflyModule } from '@/interface/modules/firefly/firefly.module';
import { configLoad, consulConfig, databaseConfig } from '@/infrastructure/config';
import { ConsulModule, KvService } from '@/infrastructure/consul';
import { ExceptionProvider } from 'src/interface/exception';
import { CacheModule } from '@nestjs/cache-manager';
import { REDIS_INSTANCE, RedisModule } from '@/infrastructure/redis';
import { MailModule } from '@/infrastructure/mail';
import { DifyModule } from '@/infrastructure/dify';
import { GuardProviders } from 'src/interface/guard';
import { WechatModule } from '@/interface/modules/wechat/wechat.module';
import { FallbackModule } from '@/interface/modules/fallback/fallback.module';
import { AuthModule } from '@/interface/modules/auth/auth.module';
import { CacheableMemory, Keyv } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { RedisClientType } from 'redis';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '@/interface/modules/token/token.module';
import { interceptors } from '@/interface/interceptor';
import { JournalMeta } from '@/core/firefly/domain/entities/journal-meta.entity';

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
    // mysql模块
    TypeOrmModule.forRootAsync({
      name: '__firefly__',
      useFactory: async (kvService: KvService, dbConfig: ConfigType<typeof databaseConfig>) => {
        const config = await kvService.get('db');
        return {
          ...dbConfig.firefly,
          ...config.firefly,
          entities: [JournalMeta],
        };
      },
      inject: [KvService, databaseConfig.KEY],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (kvService: KvService, dbConfig: ConfigType<typeof databaseConfig>) => {
        const config = await kvService.get('db');
        return {
          ...dbConfig.mysql,
          ...config.mysql,
        };
      },
      inject: [KvService, databaseConfig.KEY],
    }),
    MailModule.forRootAsync({
      isGlobal: true,
      useFactory: async (kvService: KvService) => {
        const config = await kvService.get('token');
        return {
          ...config.subscriptionMail,
        };
      },
      inject: [KvService],
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
    DifyModule.forRootAsync({
      isGlobal: true,
      useFactory: async (kvService: KvService) => {
        const config = await kvService.get('token');
        return {
          ...config.dify,
        };
      },
      inject: [KvService],
    }),
    ScheduleModule.forRoot(),
    /**
     * 业务代码模块
     */
    FireflyModule,
    WechatModule,
    AuthModule,
    TokenModule,
    FallbackModule,
  ],
  providers: [...GuardProviders, ...ExceptionProvider, ...interceptors],
})
export class AppModule {}
