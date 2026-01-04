import { type DynamicModule, Module, type ModuleMetadata, type Provider } from '@nestjs/common';
import type { CfgProviderConfig, MailModuleAsyncOptions, MailModuleConfig } from './mail.type';
import {
  MAIL_BASE_SERVICE,
  MAIL_CONFIGURATION_LOADER,
  MAIL_CONFIGURATION_TOKEN,
  MAIL_INSTANCE,
} from './constant';
import { MailBaseService } from './libs/mail-base.service';
import { deepMerge } from '@/shared/toolkits/object';
import { createInstance } from './libs/create-instance';
import { MailOpenModule } from '@/infrastructure/mail/libs/mail-open.module';

type CombineOptions = MailModuleConfig | CfgProviderConfig;

@Module({
  imports: [MailOpenModule],
})
export class MailModule {
  /**
   * 负责创建异步配置 Provider 的私有静态方法，并写入全局的配置中
   */
  private static createCfgProvider(options: CombineOptions): Provider<MailModuleConfig> {
    const providerOptions: CfgProviderConfig =
      'useFactory' in options
        ? options
        : {
            useFactory: () => options,
          };
    return {
      provide: MAIL_CONFIGURATION_LOADER,
      useFactory: async (config, ...args) => {
        const userConfig = await providerOptions.useFactory(...args);
        return deepMerge(config, userConfig);
      },
      inject: [MAIL_CONFIGURATION_TOKEN, ...(providerOptions.inject || [])],
    };
  }

  /**
   * 负责创建异步配置 Provider 的私有静态方法
   */
  private static createBaseService(): Provider {
    return {
      provide: MailBaseService,
      useClass: MailBaseService,
    };
  }

  private static createModule(options: CombineOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [this.createCfgProvider(options), createInstance(), this.createBaseService()],
      exports: [MailBaseService, MAIL_INSTANCE],
    };
  }

  static forRootAsync(
    options: Pick<ModuleMetadata, 'imports'> & MailModuleAsyncOptions
  ): DynamicModule {
    const { imports, isGlobal, ...factoryOptions } = options;
    return {
      global: isGlobal,
      ...this.createModule(factoryOptions),
      imports: options.imports || [],
    };
  }
}
