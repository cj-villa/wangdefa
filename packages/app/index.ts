import Koa from 'koa';
const app = new Koa();

app.use(async (ctx) => {
  ctx.type = 'html';
  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <div id="root">root Element</div>
      <script src="http://localhost:9000/main.js"></script>
    </body>
    </html>
  `;
});

app.listen(3000);
