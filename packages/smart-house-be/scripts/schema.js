const { ConfigLoader } = require('../dist/infrastructure/config/configuration');
const { ConsulBaseService } = require('../dist/infrastructure/consul/libs/consul-base.service');
const { KvService } = require('../dist/infrastructure/consul');
const process = require('node:process');
const fs = require('fs');
const path = require('path');

const main = async () => {
  process.env.NODE_ENV = 'development';
  const consulConfig = new ConfigLoader('consul').load();
  const dbConfig = new ConfigLoader('db').load();
  const consulBaseService = new ConsulBaseService(consulConfig);
  const kvService = new KvService(consulBaseService, consulConfig);
  const data = await kvService.get('db');
  console.log('data', { ...data.mysql, ...dbConfig.mysql });
  fs.writeFileSync(
    path.resolve(__dirname, '../static/.schema.ts'),
    `import { DataSource } from 'typeorm';
  module.exports = new DataSource({
    ...${JSON.stringify({ ...data.mysql, ...dbConfig.mysql })},
    entities: ['src/**/*.entity.ts'],
    migrations: ['scripts/migrations/*.ts'],
  });`
  );
  process.exit(0);
};

main();
