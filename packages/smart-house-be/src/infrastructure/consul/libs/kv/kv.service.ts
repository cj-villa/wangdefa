import { Inject, Injectable } from '@nestjs/common';
import { ConsulBaseService } from '../consul-base.service';
import { parseJson, stringifyJson } from '@/shared/toolkits/object';
import {
  CONSUL_CONFIGURATION_TOKEN,
  CONSUL_GLOBAL_DATA,
  CONSUL_PRE_FETCH_KEYS,
} from '@/infrastructure/consul/constant';
import type { ConsulKvModuleConfig } from '@/infrastructure/consul';
import { get, type PropertyPath } from 'lodash';
import { InjectLogger, LokiLogger } from '@/interface/middleware/inject-logger';

@Injectable()
export class KvService {
  private readonly maxSubscribeFailedCount = 3;
  @InjectLogger(KvService.name)
  private readonly logger: LokiLogger;

  constructor(
    private consulBaseService: ConsulBaseService,
    @Inject(CONSUL_CONFIGURATION_TOKEN) private config: ConsulKvModuleConfig
  ) {
    global[CONSUL_GLOBAL_DATA] = {};
    const preload = new Set<string>([...config.preload, ...global[CONSUL_PRE_FETCH_KEYS]]);
    this.logger.info(`prefetch consul: ${stringifyJson([...preload])}`);
    preload.forEach((key) => {
      this.subscribe(key);
    });
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
      throw new Error('subscribe failed');
    }
    return this.consulBaseService
      .get(`/v1/kv/wangdefa/${key}`, {
        params: {
          index: index ?? 0,
          wait: '60s',
        },
      })
      .then((res) => {
        global[CONSUL_GLOBAL_DATA][key] = this.decodeValue(res[0].Value);
        if (index !== undefined) {
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
    return this.subscribe(key, subscribe ? 0 : undefined);
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
