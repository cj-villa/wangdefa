import { type DynamicModule, Module, type ModuleMetadata, type Provider } from '@nestjs/common';
import type { CfgProviderConfig, DifyModuleAsyncOptions, DifyModuleConfig } from './dify.type';
import { DIFY_BASE_SERVICE, DIFY_CONFIGURATION_LOADER, DIFY_CONFIGURATION_TOKEN } from './constant';
import { DifyBaseService } from './libs/dify-base.service';
import { DifyOpenModule } from './libs/dify-open.module';
import { deepMerge } from '@/shared/toolkits/object';

type CombineOptions = DifyModuleConfig | CfgProviderConfig;

@Module({ imports: [DifyOpenModule] })
export class DifyModule {
  /**
   * 负责创建异步配置 Provider 的私有静态方法，并写入全局的配置中
   */
  private static createCfgProvider(options: CombineOptions): Provider<DifyModuleConfig> {
    const providerOptions: CfgProviderConfig =
      'useFactory' in options
        ? options
        : {
            useFactory: () => options,
          };
    return {
      provide: DIFY_CONFIGURATION_LOADER,
      useFactory: async (config, ...args) => {
        const userConfig = await providerOptions.useFactory(...args);
        return deepMerge(config, userConfig);
      },
      inject: [DIFY_CONFIGURATION_TOKEN, ...(providerOptions.inject || [])],
    };
  }

  /**
   * 负责创建异步配置 Provider 的私有静态方法
   */
  private static createBaseService(): Provider {
    return {
      provide: DifyBaseService,
      useFactory: (baseService) => baseService,
      inject: [DIFY_BASE_SERVICE],
    };
  }

  private static createModule(options: CombineOptions): DynamicModule {
    return {
      module: DifyModule,
      providers: [this.createCfgProvider(options), this.createBaseService()],
      exports: [DifyBaseService],
    };
  }

  static forRootAsync(
    options: Pick<ModuleMetadata, 'imports'> & DifyModuleAsyncOptions
  ): DynamicModule {
    const { imports, isGlobal, ...factoryOptions } = options;
    return {
      global: isGlobal,
      ...this.createModule(factoryOptions),
      imports: options.imports || [],
    };
  }
}
