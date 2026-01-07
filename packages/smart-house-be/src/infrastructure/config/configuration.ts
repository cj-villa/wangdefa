import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { deepMerge } from '@/shared/toolkits/object';
import { get } from 'lodash';
import { type GlobalConfig } from '@/infrastructure/config/type';

const envPrefix = {
  development: 'dev',
  production: 'prod',
};

const CONFIG_GLOBAL_KEYS = Symbol('CONFIG_GLOBAL_KEYS');

/**
 * 配置文件的读取方法，会根据环境进行配置文件的合并操作
 */
export class ConfigLoader<T extends Record<string, any>> {
  static YAML_CONFIG_DIR = join(__dirname, '../../../config');

  constructor(private readonly token: string) {}

  /**
   * Load config file
   * @param env Whether to load env config file
   * @returns Config object
   */
  private loadFile(env?: boolean) {
    if (env && !envPrefix[process.env.NODE_ENV]) {
      return {} as T;
    }
    const fileName = env ? `${this.token}.${envPrefix[process.env.NODE_ENV]}` : this.token;
    const filePath = join(ConfigLoader.YAML_CONFIG_DIR, `${fileName}.yaml`);
    if (!fs.existsSync(filePath)) {
      return {} as T;
    }
    return yaml.load(readFileSync(filePath, 'utf8')) as T;
  }

  load() {
    const base = this.loadFile();
    const env = this.loadFile(true);
    const data = deepMerge(base, env);
    global[CONFIG_GLOBAL_KEYS] = global[CONFIG_GLOBAL_KEYS] || {};
    global[CONFIG_GLOBAL_KEYS][this.token] = data;
    return data;
  }

  register() {
    return registerAs<T>(this.token, this.load.bind(this));
  }
}

export const getConfig = <K extends keyof GlobalConfig, TKey extends keyof GlobalConfig[K]>(
  key: K,
  path: TKey | [TKey]
): GlobalConfig[K][TKey] => {
  return get(global[CONFIG_GLOBAL_KEYS]?.[key], path);
};
