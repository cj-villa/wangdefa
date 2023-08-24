const path = require('path');

const DIST_PATH = path.join(__dirname, '../../dist');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './index.tsx'),
  output: {
    path: DIST_PATH,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    contentBase: DIST_PATH,
    compress: true,
    port: 9000,
    hot: true,
  },
};
