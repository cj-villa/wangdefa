import { Module, type DynamicModule, type ModuleMetadata, type Provider } from '@nestjs/common';
import {
  CONSUL_BASE_SERVICE,
  CONSUL_CONFIGURATION_LOADER,
  CONSUL_CONFIGURATION_TOKEN,
} from '@/infrastructure/consul/constant';
import { KvService } from './libs/kv';
import type {
  CfgProviderConfig,
  ConsulKvModuleAsyncOptions,
  ConsulKvModuleConfig,
} from './consul.type';
import { deepMerge } from '@/shared/toolkits/object';
import { ConsulOpenModule } from './libs/consul-open.module';
import { ConsulBaseService } from '@/infrastructure/consul/libs/consul-base.service';
import { KvRecordService } from '@/infrastructure/consul/libs/kv/record.service';

type CombineOptions = ConsulKvModuleConfig | CfgProviderConfig;

@Module({
  imports: [ConsulOpenModule],
})
export class ConsulModule {
  /**
   * 负责创建异步配置 Provider 的私有静态方法，并写入全局的配置中
   */
  private static createCfgProvider(options: CombineOptions): Provider<ConsulKvModuleConfig> {
    const providerOptions: CfgProviderConfig =
      'useFactory' in options
        ? options
        : {
            useFactory: () => options,
          };
    return {
      provide: CONSUL_CONFIGURATION_LOADER,
      useFactory: (config, ...args) => {
        const userConfig = providerOptions.useFactory(...args);
        return deepMerge(config, userConfig);
      },
      inject: [CONSUL_CONFIGURATION_TOKEN, ...(providerOptions.inject || [])],
    };
  }

  /**
   * 负责创建异步配置 Provider 的私有静态方法
   */
  private static createBaseService(): Provider {
    return {
      provide: ConsulBaseService,
      useFactory: (baseService) => baseService,
      inject: [CONSUL_BASE_SERVICE],
    };
  }

  private static createKvService(): Provider {
    return {
      provide: KvService,
      useFactory: async (baseService, config) => {
        const kvService = new KvService(baseService, config);
        await kvService.preLoad();
        return kvService;
      },
      inject: [CONSUL_BASE_SERVICE, CONSUL_CONFIGURATION_TOKEN],
    };
  }

  private static createModule(options: CombineOptions): DynamicModule {
    return {
      module: ConsulModule,
      providers: [
        this.createCfgProvider(options),
        this.createBaseService(),
        this.createKvService(),
        KvRecordService,
      ],
      exports: [ConsulBaseService, KvService, KvRecordService],
    };
  }

  static forRoot(config: ConsulKvModuleConfig): DynamicModule {
    return this.createModule(config);
  }

  static forRootAsync(
    options: Pick<ModuleMetadata, 'imports'> & ConsulKvModuleAsyncOptions
  ): DynamicModule {
    const { imports, isGlobal, ...factoryOptions } = options;
    return {
      global: isGlobal,
      ...this.createModule(factoryOptions),
      imports: options.imports || [],
    };
  }
}
