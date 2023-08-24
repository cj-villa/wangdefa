export type ArrayWrapType<T extends Object = Object> = {
  [P in keyof T]: T[P] extends Array<any> ? T[P] : T[P] | T[P][];
};

export type QueryType<T extends any = any> = Partial<
  T extends Object ? ArrayWrapType<T & { userId: string }> : T
>;
