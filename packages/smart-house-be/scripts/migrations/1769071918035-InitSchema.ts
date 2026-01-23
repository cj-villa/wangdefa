import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769071918035 implements MigrationInterface {
    name = 'InitSchema1769071918035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`transaction_price\` \`fee\` decimal(8,4) NOT NULL COMMENT '交易价格'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`amount\` \`amount\` decimal(10,2) NOT NULL COMMENT '每份交易价格'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`fee\` \`fee\` decimal(8,4) NOT NULL COMMENT '手续费率'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`fee\` \`fee\` decimal(8,4) NOT NULL COMMENT '交易价格'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`amount\` \`amount\` decimal(10,2) NOT NULL COMMENT '交易金额'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`fee\` \`transaction_price\` decimal(8,4) NOT NULL COMMENT '交易价格'`);
    }

}
