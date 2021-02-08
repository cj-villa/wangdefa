import Router from 'koa-router';

interface IRoutersItem {
  method: 'get' | 'post';
  path: string;
  propertyKey: string;
}

const BASEPATH = Symbol('basePath');
const ROUTERS = Symbol('router');

export const router = new Router();

export const Route = (basePath: string) => {
  return (target: Function) => {
    const { prototype } = target;
    prototype[BASEPATH] = basePath;
    const routers: IRoutersItem[] = prototype[ROUTERS];
      while(routers.length) {
        const routerItem = routers.pop();
        if (!routerItem) {
          return;
        }
        const { method, path, propertyKey } = routerItem;
        router[method](`${basePath}${path}`, prototype[propertyKey]);
      }
  }
};

const registerMethod = (method: 'get' | 'post', path: string, prototype: Function['prototype'], propertyKey: string) => {
  if (prototype[BASEPATH]) {
    router[method](`${prototype[BASEPATH]}${path}`, prototype[propertyKey]);
    return;
  }
  prototype[ROUTERS] = (prototype[ROUTERS] || []).concat([{
    method,
    path,
    propertyKey,
  }]);
};

export const Get = (path: string) => {
  return (prototype: Function['prototype'], propertyKey: string) => registerMethod('get', path, prototype, propertyKey);
};

export const Post = (path: string) => {
  return (prototype: Function['prototype'], propertyKey: string) => registerMethod('post', path, prototype, propertyKey);
};