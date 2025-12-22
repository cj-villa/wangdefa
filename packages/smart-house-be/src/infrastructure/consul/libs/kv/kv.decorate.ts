import { KvService } from '@/infrastructure/consul';
import { CONSUL_PRE_FETCH_KEYS } from '@/infrastructure/consul/constant';
import { get, type PropertyPath } from 'lodash'; // 你的 KvService

export const Kv = (consulKey: string, path?: PropertyPath): PropertyDecorator => {
  global[CONSUL_PRE_FETCH_KEYS] = global[CONSUL_PRE_FETCH_KEYS] || new Set();
  (global[CONSUL_PRE_FETCH_KEYS] as Set<string>).add(consulKey);
  return (target: Object, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return KvService.get(consulKey, path);
      },
      enumerable: true,
      configurable: true,
    });
  };
};
