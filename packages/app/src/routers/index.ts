/** 加载 routers */
import * as path from 'path';
import * as glob from 'glob';

const EXCLUDEPATH = 'index';

/** 载入除 EXCLUDEPATH 以外所有的路由 */
glob.sync(path.join(__dirname, `./**/!(${EXCLUDEPATH}).ts`)).forEach((filePath) => import(filePath));

export { router } from 'decorators/router';
