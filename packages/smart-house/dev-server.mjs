import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from './webpack.config.mjs';

const app = express();
const compiler = webpack(webpackConfig);

const devInstance = webpackDevMiddleware(compiler, {
  publicPath: '/',
});

devInstance.waitUntilValid(() => {
  console.log('listening on port 3000!');
});

app
  .use((req, res, next) => {
    if (!/(\.(?!html)\w+$|__webpack.*)/.test(req.url)) {
      req.url = '/';
    }
    next();
  })
  .use(devInstance)
  .use(
    webpackHotMiddleware(compiler, {
      //   log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    })
  );

app.listen(3000);
