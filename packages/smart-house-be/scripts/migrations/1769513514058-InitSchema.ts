import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769513514058 implements MigrationInterface {
    name = 'InitSchema1769513514058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`track_financial_transaction\` (\`id\` varchar(36) NOT NULL, \`financial_id\` varchar(255) NOT NULL COMMENT '基金Id', \`transaction_type\` enum ('BUY', 'SELL') NOT NULL COMMENT '交易类型：BUY-买入，SELL-卖出', \`shares\` decimal(10,0) NOT NULL COMMENT '交易份额', \`current_shares\` decimal(10,0) NOT NULL COMMENT '当前总份额', \`ensure_date\` datetime NOT NULL COMMENT '确认份额的时间', \`transaction_date\` datetime NOT NULL COMMENT '交易时间', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="基金交易记录表"`);
        await queryRunner.query(`CREATE TABLE \`track_financial\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(32) NOT NULL COMMENT '基金的名称', \`code\` varchar(32) NOT NULL COMMENT '基金编码', \`channel\` enum ('icbc_financial', 'cmb_financial', 'cmb_fund') NOT NULL COMMENT '基金的购买渠道', \`user_id\` varchar(255) NOT NULL COMMENT '绑定的用户', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`idx_code_user_id\` (\`code\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="正在追踪的基金记录表"`);
        await queryRunner.query(`CREATE TABLE \`financial_value_trend\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(32) NOT NULL COMMENT '基金编码', \`date\` datetime(6) NOT NULL COMMENT '当前净值时间', \`balance\` decimal(13,6) NOT NULL COMMENT '价值（元）', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="基金价值表"`);
        await queryRunner.query(`CREATE TABLE \`financial_net_value_trend\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(32) NOT NULL COMMENT '基金编码', \`date\` datetime(6) NOT NULL COMMENT '当前净值时间', \`type\` enum ('net', 'profit') NOT NULL COMMENT '基金类型，net为单位净值，profit为万份收益' DEFAULT 'net', \`value\` decimal(10,6) NOT NULL COMMENT '单位净值/万份收益（元）', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="基金净值表"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`financial_net_value_trend\``);
        await queryRunner.query(`DROP TABLE \`financial_value_trend\``);
        await queryRunner.query(`DROP INDEX \`idx_code_user_id\` ON \`track_financial\``);
        await queryRunner.query(`DROP TABLE \`track_financial\``);
        await queryRunner.query(`DROP TABLE \`track_financial_transaction\``);
    }

}
