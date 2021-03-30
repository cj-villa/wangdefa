import * as Koa from 'koa';
import { models } from 'model/index';

export const model = (ctx: Koa.Context) => {
  ctx.models = models;
};
