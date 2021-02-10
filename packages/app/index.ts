import Koa from 'koa';

import { extendCtx } from './src/middleware/extend-ctx';
import { router } from './src/routers';

const app = new Koa();

app
  .use(extendCtx)
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(80);
console.log('app listening at port 80');
