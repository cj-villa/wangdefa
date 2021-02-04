import Koa from 'koa';
import * as extendFns from '../extends';

export const extendCtx = async (ctx: Koa.Context, next: Koa.Next) => {
  return Promise
    .all(Object.values(extendFns).map((fn) =>fn(ctx)))
    .catch(console.error)
    .then(() => {
      next();
    });
};