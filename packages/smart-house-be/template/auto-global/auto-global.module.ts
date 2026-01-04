import { type DynamicModule, Module, type ModuleMetadata, type Provider } from '@nestjs/common';
import type {
  CfgProviderConfig,
  AutoGlobalModuleAsyncOptions,
  AutoGlobalModuleConfig,
} from './auto-global.type';
import {
  AUTO_GLOBAL_BASE_SERVICE,
  AUTO_GLOBAL_CONFIGURATION_LOADER,
  AUTO_GLOBAL_CONFIGURATION_TOKEN,
  AUTO_GLOBAL_INSTANCE,
} from './constant';
import { AutoGlobalBaseService } from './libs/auto-global-base.service';
import { AutoGlobalOpenModule } from './libs/auto-global-open.module';
import { deepMerge } from '@/shared/toolkits/object';
import { createInstance } from './libs/create-instance';

type CombineOptions = AutoGlobalModuleConfig | CfgProviderConfig;

@Module({ imports: [AutoGlobalOpenModule] })
export class AutoGlobalModule {
  /**
   * 负责创建异步配置 Provider 的私有静态方法，并写入全局的配置中
   */
  private static createCfgProvider(options: CombineOptions): Provider<AutoGlobalModuleConfig> {
    const providerOptions: CfgProviderConfig =
      'useFactory' in options
        ? options
        : {
            useFactory: () => options,
          };
    return {
      provide: AUTO_GLOBAL_CONFIGURATION_LOADER,
      useFactory: async (config, ...args) => {
        const userConfig = await providerOptions.useFactory(...args);
        return deepMerge(config, userConfig);
      },
      inject: [AUTO_GLOBAL_CONFIGURATION_TOKEN, ...(providerOptions.inject || [])],
    };
  }

  /**
   * 负责创建异步配置 Provider 的私有静态方法
   */
  private static createBaseService(): Provider {
    return {
      provide: AutoGlobalBaseService,
      useFactory: (baseService) => baseService,
      inject: [AUTO_GLOBAL_BASE_SERVICE],
    };
  }

  private static createModule(options: CombineOptions): DynamicModule {
    return {
      module: AutoGlobalModule,
      providers: [this.createCfgProvider(options), createInstance(), this.createBaseService()],
      exports: [AutoGlobalBaseService, AUTO_GLOBAL_INSTANCE],
    };
  }

  static forRootAsync(
    options: Pick<ModuleMetadata, 'imports'> & AutoGlobalModuleAsyncOptions
  ): DynamicModule {
    const { imports, isGlobal, ...factoryOptions } = options;
    return {
      global: isGlobal,
      ...this.createModule(factoryOptions),
      imports: options.imports || [],
    };
  }
}
