import { Module, type DynamicModule, type ModuleMetadata, type Provider } from '@nestjs/common';
import {
  REDIS_SERVICE,
  REDIS_CONFIGURATION_LOADER,
  REDIS_CONFIGURATION_TOKEN,
  REDIS_INSTANCE,
} from './constant';
import type {
  CfgProviderConfig,
  RedisModuleAsyncOptions,
  RedisBaseModuleConfig,
} from './redis.type';
import { deepMerge } from '@/shared/toolkits/object';
import { RedisBaseService } from './libs/redis-base.service';
import { RedisOpenModule } from './libs/redis-open.module';
import { createClient, type RedisClientType, type RedisClientOptions } from 'redis';

type CombineOptions = RedisBaseModuleConfig | CfgProviderConfig;

@Module({
  imports: [RedisOpenModule],
})
export class RedisModule {
  /**
   * 负责创建异步配置 Provider 的私有静态方法，并写入全局的配置中
   */
  private static createCfgProvider(options: CombineOptions): Provider<RedisBaseModuleConfig> {
    const providerOptions: CfgProviderConfig =
      'useFactory' in options
        ? options
        : {
            useFactory: () => options,
          };
    return {
      provide: REDIS_CONFIGURATION_LOADER,
      useFactory: async (config, ...args) => {
        const userConfig = await providerOptions.useFactory(...args);
        return deepMerge(config, userConfig);
      },
      inject: [REDIS_CONFIGURATION_TOKEN, ...(providerOptions.inject || [])],
    };
  }

  /**
   * 负责创建异步配置 Provider 的私有静态方法
   */
  private static createProviders(): Provider[] {
    return [
      {
        provide: REDIS_INSTANCE,
        useFactory: (config: RedisClientOptions) => {
          return createClient(config);
        },
        inject: [REDIS_CONFIGURATION_LOADER],
      },
      {
        provide: RedisBaseService,
        useFactory: (baseService: RedisBaseService, redis: RedisClientType) => {
          baseService.register(redis);
          return baseService;
        },
        inject: [REDIS_SERVICE, REDIS_INSTANCE],
      },
    ];
  }

  private static createModule(options: CombineOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [this.createCfgProvider(options), ...this.createProviders()],
      exports: [REDIS_INSTANCE, RedisBaseService],
    };
  }

  static forRoot(config: RedisBaseModuleConfig): DynamicModule {
    return this.createModule(config);
  }

  static forRootAsync(
    options: Pick<ModuleMetadata, 'imports'> & RedisModuleAsyncOptions
  ): DynamicModule {
    const { imports, isGlobal, ...factoryOptions } = options;
    return {
      global: isGlobal,
      ...this.createModule(factoryOptions),
      imports: options.imports || [],
    };
  }
}
