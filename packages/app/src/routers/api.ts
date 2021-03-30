import koa from 'koa';
import { Route, Get } from '../decorators/router';

@Route('/api')
export class API {
  @Get('')
  protected async renderPage(ctx: koa.Context, next: koa.Next) {
    const result = await ctx.models.users.find();
    console.log('result', result);
    ctx.body = result;
    return next();
  }
}
