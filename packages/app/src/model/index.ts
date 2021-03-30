/**
 * @description: 加载 model
 */
import * as path from 'path';
import * as glob from 'glob';
import { IModel } from 'utils/model';

/** 不加载的路径 */
const EXCLUDEPATH = 'index';
const models: {
  [key: string]: IModel;
} = {};

glob.sync(path.join(__dirname, `../model/**/!(${EXCLUDEPATH}).ts`)).forEach((filePath) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RequiredModel = require(filePath).default;
  const model: IModel = new RequiredModel();
  models[model.name] = model;
});

export { models };
