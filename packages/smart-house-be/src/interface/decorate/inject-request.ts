import { requestContext } from '@/interface/interceptor/request-context';
import { get, type PropertyPath } from 'lodash';

export const InjectRequest = (key: PropertyPath) => {
  return (target: Object, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get: () => {
        const request = requestContext.getStore();
        return get(request, key);
      },
      enumerable: true,
      configurable: true,
    });
  };
};
