import type { RedisOptions } from 'ioredis';
import type { DataSourceOptions } from 'typeorm';

const database: Partial<DataSourceOptions> = {
  // host: 'unraid.lcj.com',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  // username: 'nextcloud',
  password: 'tWKsmGqC)tmY*nn9vw62',
  database: 'wangdefa',
};

const redis: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
  password: 'mypassword',
};

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database,
  redis,
  auth: {
    secret: 'mDHQgyT)7ZNN0Zq9N*Kp',
    expiresIn: '365d',
  },
});
