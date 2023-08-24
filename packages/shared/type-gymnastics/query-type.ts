export type ArrayWrapType<T extends Object = Object> = {
  [P in keyof T]: T[P] extends any[] ? T[P] : T[P] | Array<T[P]>;
};

export type QueryType<T extends any = any> = Partial<
  T extends Object ? ArrayWrapType<T & { userId: string }> : T
>;
