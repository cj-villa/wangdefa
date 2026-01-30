import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769755395843 implements MigrationInterface {
    name = 'InitSchema1769755395843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`current_shares\` \`amount\` decimal NOT NULL COMMENT '当前总份额'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` CHANGE \`code\` \`financial_id\` varchar(32) NOT NULL COMMENT '基金编码'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` COMMENT '理财价值表'`);
        await queryRunner.query(`ALTER TABLE \`financial_net_value_trend\` COMMENT '理财净值表'`);
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`amount\` \`amount\` decimal(10,2) NOT NULL COMMENT '交易金额'`);
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`shares\` \`shares\` decimal(13,6) NOT NULL COMMENT '交易份额，确认份额后会更新，年化的类型没有份额' DEFAULT '0.000000'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` DROP COLUMN \`financial_id\``);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` ADD \`financial_id\` varchar(255) NOT NULL COMMENT '理财Id'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` CHANGE \`balance\` \`balance\` decimal(13,6) NOT NULL COMMENT '当前价值（元）'`);
        await queryRunner.query(`ALTER TABLE \`financial_net_value_trend\` CHANGE \`code\` \`code\` varchar(32) NOT NULL COMMENT '理财编码'`);
        await queryRunner.query(`ALTER TABLE \`financial_net_value_trend\` CHANGE \`type\` \`type\` enum ('net', 'profit') NOT NULL COMMENT '理财类型，net为单位净值，profit为万份收益' DEFAULT 'net'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`financial_net_value_trend\` CHANGE \`type\` \`type\` enum ('net', 'profit') NOT NULL COMMENT '基金类型，net为单位净值，profit为万份收益' DEFAULT 'net'`);
        await queryRunner.query(`ALTER TABLE \`financial_net_value_trend\` CHANGE \`code\` \`code\` varchar(32) NOT NULL COMMENT '基金编码'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` CHANGE \`balance\` \`balance\` decimal(13,6) NOT NULL COMMENT '价值（元）'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` DROP COLUMN \`financial_id\``);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` ADD \`financial_id\` varchar(32) NOT NULL COMMENT '基金编码'`);
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`shares\` \`shares\` decimal(10,2) NOT NULL COMMENT '交易份额'`);
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`amount\` \`amount\` decimal NOT NULL COMMENT '当前总份额'`);
        await queryRunner.query(`ALTER TABLE \`financial_net_value_trend\` COMMENT '基金净值表'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` COMMENT '基金价值表'`);
        await queryRunner.query(`ALTER TABLE \`financial_value_trend\` CHANGE \`financial_id\` \`code\` varchar(32) NOT NULL COMMENT '基金编码'`);
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`amount\` \`current_shares\` decimal NOT NULL COMMENT '当前总份额'`);
    }

}
