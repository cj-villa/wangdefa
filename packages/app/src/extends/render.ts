import Koa from 'koa';
import path from 'path';
import ejs from 'ejs';

export const render = (ctx: Koa.Context) => {
  ctx.render = (file: string, data?: ejs.Data) => {
    const filePath = path.join(__dirname, '../views', `${file}.ejs`);
    return ejs.renderFile(filePath, data ?? {})
      .then((template) => {
        ctx.type = 'html';
        ctx.body = template;
      });
  };
};
