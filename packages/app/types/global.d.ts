import Router from 'koa-router';
import { models } from 'model/index';

export interface PureObject {
  [key: string]: any;
}
export interface globalValue {
  router?: Router | null;
  sqlInstance?: any;
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Global extends globalValue {}
  }
}

declare module 'koa' {
  interface DefaultContext {
    models: typeof models;
  }
}
