import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769063691789 implements MigrationInterface {
    name = 'InitSchema1769063691789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`track_fund_transaction\` (\`id\` varchar(36) NOT NULL, \`fund_id\` varchar(255) NOT NULL COMMENT '基金Id', \`user_id\` varchar(255) NOT NULL COMMENT '用户ID', \`transaction_type\` enum ('BUY', 'SELL') NOT NULL COMMENT '交易类型：BUY-买入，SELL-卖出', \`amount\` decimal(10,2) NOT NULL COMMENT '交易金额', \`shares\` decimal(12,4) NOT NULL COMMENT '交易份额', \`transaction_price\` decimal(8,4) NOT NULL COMMENT '交易价格', \`transaction_date\` datetime NOT NULL COMMENT '开始确认份额的时间，默认根据创建时间计算T+1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="基金交易记录表"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`track_fund_transaction\``);
    }

}
