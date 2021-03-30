import mysql from 'mysql';
import mysqlConfig from 'config/mysql.json';

const CONNECTIONLIMIT = 10;

export class Sql {
  public pool?: mysql.Pool;

  public constructor(connectionLimit = CONNECTIONLIMIT) {
    if (global.sqlInstance) {
      // eslint-disable-next-line no-constructor-return
      return global.sqlInstance;
    }
    global.sqlInstance = this;
    this.connect(connectionLimit);
  }

  /** 执行数据库语句 */
  public query<T extends any = any>(sql: string) {
    return new Promise((resolve, reject) => {
      if (!this?.pool?.query) {
        reject(new Error('no pool'));
        return;
      }
      this.pool.query(sql, (error, result: T) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  /** 链接数据库 */
  private connect(connectionLimit = CONNECTIONLIMIT) {
    this.pool = mysql.createPool({
      connectionLimit,
      database: 'wangdefa',
      ...mysqlConfig,
    });
  }
}

/** 单例 */
global.sqlInstance = null;
