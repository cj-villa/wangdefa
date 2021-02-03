const path = require('path');

const DISTPATH = path.join(__dirname, '../../dist');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './index.tsx'),
  output: {
    path: DISTPATH,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    contentBase: DISTPATH,
    compress: true,
    port: 9000,
    hot: true
  }
};
