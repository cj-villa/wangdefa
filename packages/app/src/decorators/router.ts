import Router from 'koa-router';

interface IRoutersItem {
  method: 'get';
  path: string;
  propertyKey: string;
}

export const router = new Router();
const routers: IRoutersItem[] = [];

export const Route = <T extends Function = Function>(basePath: string) => {
  return (target: T) => {
    while(routers.length) {
      const routerItem = routers.pop();
      if (!routerItem) {
        return;
      }
      const {
        method,
        path,
        propertyKey,
      } = routerItem;
      router[method](`${basePath}${path}`, target.prototype[propertyKey]);
    }
  }
};

export const Get = <T extends Function = Function>(path: string) => {
  return (prototype: any, propertyKey: string) => {
    routers.push({
      method: 'get',
      path,
      propertyKey,
    });
  };
};