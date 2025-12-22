import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { type RedisClientOptions } from 'redis';

/**
 * 同步模块配置
 */
export interface RedisBaseModuleConfig extends RedisClientOptions {}

/** 配置模块的创建参数 */
export type CfgProviderConfig = Pick<
  FactoryProvider<RedisBaseModuleConfig>,
  'inject' | 'useFactory'
>;

/**
 * 异步模块创建选项
 */
export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>,
    CfgProviderConfig {
  isGlobal?: boolean;
}
