import { get } from 'lodash';
import { requestContext, RequestStore } from '@/interface/interceptor/request-context';

type Keys<TObject extends object> = keyof TObject | [keyof TObject];

export const InjectRequest = (key?: Keys<RequestStore>) => {
  return (target: object, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get: () => {
        const request = requestContext.getStore();
        return key ? get(request, key) : request;
      },
      enumerable: true,
      configurable: true,
    });
  };
};
