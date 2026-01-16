import { Inject, Injectable } from '@nestjs/common';
import { ConsulBaseService } from '../consul-base.service';
import {
  CONSUL_CONFIGURATION_TOKEN,
  CONSUL_GLOBAL_DATA,
  CONSUL_PRE_FETCH_KEYS,
} from '@/infrastructure/consul/constant';
import type { ConsulKvModuleConfig } from '@/infrastructure/consul';
import { get, type PropertyPath } from 'lodash';
import { InjectLogger, LokiLogger } from '@/interface/decorate/inject-logger';
import { parseJson, stringifyJson } from '@/shared/toolkits/transform';

@Injectable()
export class KvService {
  private readonly maxSubscribeFailedCount = 3;
  @InjectLogger(KvService.name)
  private readonly logger: LokiLogger;

  constructor(
    private consulBaseService: ConsulBaseService,
    @Inject(CONSUL_CONFIGURATION_TOKEN) private readonly config: ConsulKvModuleConfig
  ) {
    global[CONSUL_GLOBAL_DATA] = {};
  }

  async preLoad() {
    const preload = new Set<string>([
      ...(this.config.preload ?? []),
      ...(global[CONSUL_PRE_FETCH_KEYS] ?? []),
    ]);
    this.logger?.info(`prefetch consul: ${stringifyJson([...preload])}`);
    for (const key of preload) {
      await this.subscribe(key, 0);
    }
  }

  /** 解码consul kv的值，并尝试parse */
  private decodeValue(value: string): any {
    const decodeStr = Buffer.from(value, 'base64').toString('utf-8');
    if (decodeStr[0] === '{' || decodeStr[0] === '[') {
      return parseJson(decodeStr);
    }
    return decodeStr;
  }

  /**
   * @description 订阅某一个key的配置变更，并更新值内存中
   * @param key 配置的key
   * @param index 是否订阅配置的变更，默认不订阅，传入ModifyIndex订阅变更
   */
  private async subscribe(key: string, index?: number, failedCount = 0) {
    if (failedCount > this.maxSubscribeFailedCount) {
      throw new Error(`subscribe ${key} failed`);
    }
    this.logger.debug(`subscribe key: ${key} index: ${index} failedCount: ${failedCount}`);
    return this.consulBaseService
      .get(`/v1/kv/wangdefa/${key}`, {
        index: index ?? 0,
        wait: '60s',
      })
      .then((res) => {
        global[CONSUL_GLOBAL_DATA][key] = this.decodeValue(res[0].Value);
        if (index !== undefined) {
          if (index !== res[0].ModifyIndex) {
            this.logger.info(`consul key ${key} updated ${index} to ${res[0].ModifyIndex}`);
          }
          this.subscribe(key, res[0].ModifyIndex);
        }
        return global[CONSUL_GLOBAL_DATA][key];
      })
      .catch((error) => {
        console.error(error);
        this.subscribe(key, index, failedCount + 1);
      });
  }

  /**
   * @description 获取某一个key的配置的值
   * @param key 配置的key
   * @param subscribe 是否订阅配置的变更，默认订阅
   * */
  get<T extends any = any>(key: string, subscribe: boolean = true): Promise<T> {
    const cacheData = KvService.get<T>(key);
    return cacheData ? Promise.resolve(cacheData) : this.subscribe(key, subscribe ? 0 : undefined);
  }

  /**
   * @description 获取某一个key的配置的值
   * @param key 配置的key
   * */
  static get<T extends any = any>(key: string, path?: PropertyPath): T {
    const data = global[CONSUL_GLOBAL_DATA][key];
    return path ? get(data, path) : data;
  }
}
