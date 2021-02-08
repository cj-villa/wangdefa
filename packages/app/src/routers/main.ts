import koa from "koa";
import { Route, Get } from "../decorators/router";

@Route('/')
class Main {

  @Get('')
  private renderPage(ctx: koa.Context) {
    ctx.render('layout');
  }
}
