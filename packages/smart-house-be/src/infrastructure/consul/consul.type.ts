import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';

/**
 * 同步模块配置
 */
export interface ConsulKvModuleConfig {
  host: string;
  token?: string;
  preload?: string[];
  prefix?: string;
}

/** 配置模块的创建参数 */
export type CfgProviderConfig = Pick<
  FactoryProvider<ConsulKvModuleConfig>,
  'inject' | 'useFactory'
>;

/**
 * 异步模块创建选项
 */
export interface ConsulKvModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>,
    CfgProviderConfig {
  isGlobal?: boolean;
}
