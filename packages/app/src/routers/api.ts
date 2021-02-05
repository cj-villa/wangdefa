import koa from "koa";
import { Route, Get } from "../decorators/router";

@Route('/api')
class API {

  @Get('')
  renderPage(ctx: koa.Context) {
    ctx.body ='api';
  }
}
