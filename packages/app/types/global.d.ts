import Router from 'koa-router';

export interface globalValue {
  router?: Router | null;
  sqlInstance?: any;
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Global extends globalValue { }
  }
}