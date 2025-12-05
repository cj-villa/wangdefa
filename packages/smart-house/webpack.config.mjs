import path from 'path';
import { fileURLToPath } from 'url';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '../../dist');

export default {
  mode: 'development',
  entry: {
    main: ['webpack-hot-middleware/client?reload=true', path.join(__dirname, './src/index.tsx')],
  },
  output: {
    path: DIST_PATH,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', './build/router-loader.mjs', 'ts-loader'],
      },
      {
        test: /\.less$/i,
        exclude: /\.module\.less$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
          },
          'less-loader',
        ],
      },
      {
        test: /\.module\.less$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:5]',
                namedExport: false,
                exportLocalsConvention: 'as-is',
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
          'less-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      src: path.join(__dirname, './src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
};
