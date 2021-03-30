import { Type } from './types';
import { Sql } from 'utils/orm';

const sql = new Sql();

export class Model<T extends any = any> {
  /** model挂载到ctx之后的名字与数据库的名字 */
  public name = '';

  /** 所有表都有的字段 */
  public baseModel = {
    id: Type.number,
    createAt: Type.number,
    editAt: Type.number,
  };

  /** model对应的数据库表字段与类型 */
  protected model = {};

  public find() {
    return sql.query<T>(`select * from ${this.name}`);
  }
}

export type IModel = Model;
export * from './types';
