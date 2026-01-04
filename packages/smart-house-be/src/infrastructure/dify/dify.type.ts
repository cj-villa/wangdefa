import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';

/**
 * 同步模块配置
 */
export interface DifyModuleConfig {
  host: string;
  token: string;
}

/** 配置模块的创建参数 */
export type CfgProviderConfig = Pick<FactoryProvider<DifyModuleConfig>, 'inject' | 'useFactory'>;

/**
 * 异步模块创建选项
 */
export interface DifyModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'>, CfgProviderConfig {
  isGlobal?: boolean;
}
