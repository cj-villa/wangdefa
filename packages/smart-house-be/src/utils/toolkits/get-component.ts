/**
 * @author: chenjieLu
 * @Description: 获取module文件
 */
import * as path from 'path';
import { globSync } from 'glob';

/**
 * @description: 获取指定目录下的所有指定的文件
 * @param {string} component - 需要搜索的指定文件
 * @param {string} baseDir - 需要搜索的目录
 * @param {boolean} [loop = false] - 是否需要遍历所有的文件
 */
const getComponent = (component: string, baseDir: string, loop: boolean = false) => {
  const syncPath = path.resolve(baseDir, `${loop ? '**' : '*'}/*${component}.{ts,js}`);
  const businessModulesPath = globSync(syncPath);

  const modules = [];
  businessModulesPath.forEach((path) => {
    const code = require(path);
    Object.values(code).forEach((module) => {
      module && modules.push(module);
    });
  });
  return modules;
};

/**
 * @description: 获取指定目录下的所有module文件
 * @param {string} baseDir - 需要搜索的目录
 * @param {boolean} [loop = false] - 是否需要遍历所有的文件
 */
export const getImports = getComponent.bind(this, 'module');

const suffixKeyMap = {
  controller: 'controllers',
  service: ['providers', 'exports'],
  module: 'imports',
  processor: 'providers',
};

const DEFAULT_SUFFIX = Object.keys(suffixKeyMap);

interface Modules {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
}

/**
 * @description: 获取指定目录下的 modules 配置
 * @param {string} baseDir - 需要搜索的目录
 * @param {string} options - 搜索module的选项
 * @param {string} [options.moduleSuffixes = ["controller", "service", "module"]] - 需要搜索的文件
 * @param {boolean} [options.loop = false] - 是否需要遍历所有的文件
 */
export const getModules = (
  baseDir: string,
  options: { moduleSuffixes?: string[]; loop?: boolean; mergeModule?: Modules } = {}
): Modules => {
  const { loop, moduleSuffixes, mergeModule = {} } = options;
  return (moduleSuffixes || DEFAULT_SUFFIX).reduce((modules, suffix) => {
    const key = suffixKeyMap[suffix];
    if (typeof key === 'string') {
      modules[key] = [
        ...(modules[key] || []),
        ...getComponent(suffix, baseDir, !!loop),
        ...(mergeModule[key] ?? []),
      ];
    } else {
      key.forEach((k) => {
        modules[k] = [...getComponent(suffix, baseDir, !!loop), ...(mergeModule[k] ?? [])];
      });
    }
    return modules;
  }, {});
};
