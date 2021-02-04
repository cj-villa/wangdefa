import Koa from 'koa';

import { extendCtx } from './src/middleware/extend-ctx';
import { router } from './src/routers';

const app = new Koa();

app
  .use(extendCtx)
  .use(router.routes())
  .use(router.allowedMethods());
  // .use(async (ctx) => {
  //   ctx.render('layout');
  // });

app.listen(3000);
