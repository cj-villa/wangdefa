import { BaseModel } from '../model';

export type InsertType<M extends BaseModel = BaseModel, K extends keyof M = 'id'> = Omit<
  M,
  keyof BaseModel | K
>;
