import Koa from 'koa';
import Router from 'koa-router';

interface globalValue {
  router?: Router | null;
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Global extends globalValue { }
  }
}

export const handlerGlobal = (ctx: Koa.Context) => {

  ctx.getGlobal = (key: keyof globalValue) => {
    return global[key];
  };

  ctx.setGlobal = <K extends keyof globalValue>(key: K, value?: globalValue[K]) => {
    global[key] = value;
  }
};
