import Koa from 'koa';
import { globalValue } from 'types/global';

export const handlerGlobal = (ctx: Koa.Context) => {
  ctx.getGlobal = (key: keyof globalValue) => {
    return global[key];
  };

  ctx.setGlobal = <K extends keyof globalValue>(key: K, value: any) => {
    global[key] = value;
  };
};
