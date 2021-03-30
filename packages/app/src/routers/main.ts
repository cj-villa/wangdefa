import koa from 'koa';
import { Route, Get } from 'decorators/router';

@Route('/')
export class Main {
  /** 渲染页面 */
  @Get('')
  protected renderPage(ctx: koa.Context) {
    ctx.render('layout');
  }
}
