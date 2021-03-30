/**
 * @description: 加载 ctx 的拓展
 */
import Koa from 'koa';
import * as extendFns from 'extends/index';

export const extendCtx = async (ctx: Koa.Context, next: Koa.Next) => {
  return Promise.all(Object.values(extendFns).map((fn) => fn(ctx)))
    .catch(console.error)
    .then(() => {
      return next();
    });
};
