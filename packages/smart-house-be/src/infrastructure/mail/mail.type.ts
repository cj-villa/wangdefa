import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import type { ImapFlowOptions } from 'imapflow';

/**
 * 同步模块配置
 */
export interface MailModuleConfig extends ImapFlowOptions {}

/** 配置模块的创建参数 */
export type CfgProviderConfig = Pick<FactoryProvider<MailModuleConfig>, 'inject' | 'useFactory'>;

/**
 * 异步模块创建选项
 */
export interface MailModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'>, CfgProviderConfig {
  isGlobal?: boolean;
}
