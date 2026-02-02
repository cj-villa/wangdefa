import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1770003926785 implements MigrationInterface {
    name = 'InitSchema1770003926785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`user_name\` varchar(32) NOT NULL COMMENT '用户名', \`nick_name\` varchar(32) NOT NULL COMMENT '用户别名', \`email\` varchar(64) NOT NULL COMMENT '邮箱', \`password\` varchar(256) NOT NULL COMMENT '密码', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_758b8ce7c18b9d347461b30228\` (\`user_id\`), UNIQUE INDEX \`IDX_d34106f8ec1ebaf66f4f8609dd\` (\`user_name\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="用户表"`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(32) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL COMMENT '三方调用token', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_d9959ee7e17e2293893444ea37\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="token表"`);
        await queryRunner.query(`CREATE TABLE \`firefly_parsing_rules\` (\`id\` varchar(36) NOT NULL, \`type\` varchar(255) NOT NULL COMMENT '解析后的字段类型', \`analysis_type\` varchar(255) NOT NULL COMMENT '解析后对应的字段类型，如：可以从鸡公煲解析出预算为午饭', \`user_id\` varchar(255) NOT NULL COMMENT '该字段使用的用户', \`source\` varchar(256) NOT NULL COMMENT '解析前的内容', \`target\` varchar(256) NOT NULL COMMENT '解析后的内容', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="firefly解析规则表"`);
        await queryRunner.query(`CREATE TABLE \`track_financial_transaction\` (\`id\` varchar(36) NOT NULL, \`financial_id\` varchar(255) NOT NULL COMMENT '基金Id', \`user_id\` varchar(255) NOT NULL COMMENT '用户Id', \`transaction_type\` enum ('BUY', 'SELL') NOT NULL COMMENT '交易类型：BUY-买入，SELL-卖出', \`amount\` decimal(10,2) NOT NULL COMMENT '交易金额', \`shares\` decimal(13,6) NOT NULL COMMENT '交易份额，确认份额后会更新，年化的类型没有份额' DEFAULT '0.000000', \`ensure_date\` datetime NOT NULL COMMENT '确认份额的时间', \`transaction_date\` datetime NOT NULL COMMENT '交易时间', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="基金交易记录表"`);
        await queryRunner.query(`CREATE TABLE \`track_financial\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(32) NOT NULL COMMENT '基金的名称', \`code\` varchar(32) NOT NULL COMMENT '基金编码', \`channel\` enum ('icbc_financial', 'cmb_financial', 'cmb_fund') NOT NULL COMMENT '基金的购买渠道', \`user_id\` varchar(255) NOT NULL COMMENT '绑定的用户', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`idx_code_user_id\` (\`code\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="正在追踪的基金记录表"`);
        await queryRunner.query(`CREATE TABLE \`financial_value_trend\` (\`id\` varchar(36) NOT NULL, \`financial_id\` varchar(255) NOT NULL COMMENT '理财Id', \`date\` datetime(6) NOT NULL COMMENT '当前净值时间', \`balance\` decimal(13,6) NOT NULL COMMENT '当前价值（元）', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="理财价值表"`);
        await queryRunner.query(`CREATE TABLE \`financial_net_value_trend\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(32) NOT NULL COMMENT '理财编码', \`date\` datetime(6) NOT NULL COMMENT '当前净值时间', \`type\` enum ('net', 'profit') NOT NULL COMMENT '理财类型，net为单位净值，profit为万份收益' DEFAULT 'net', \`value\` decimal(10,6) NOT NULL COMMENT '单位净值/万份收益（元）', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="理财净值表"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`financial_net_value_trend\``);
        await queryRunner.query(`DROP TABLE \`financial_value_trend\``);
        await queryRunner.query(`DROP INDEX \`idx_code_user_id\` ON \`track_financial\``);
        await queryRunner.query(`DROP TABLE \`track_financial\``);
        await queryRunner.query(`DROP TABLE \`track_financial_transaction\``);
        await queryRunner.query(`DROP TABLE \`firefly_parsing_rules\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9959ee7e17e2293893444ea37\` ON \`token\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_d34106f8ec1ebaf66f4f8609dd\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_758b8ce7c18b9d347461b30228\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
