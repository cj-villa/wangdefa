import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769073042732 implements MigrationInterface {
    name = 'InitSchema1769073042732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`amount\` \`amount\` decimal(10,8) NOT NULL COMMENT '每份交易价格' DEFAULT '0.00000000'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`shares\` \`shares\` decimal(10,0) NOT NULL COMMENT '交易份额'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`fee\` \`fee\` decimal(5,2) NOT NULL COMMENT '手续费率' DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`fee\` \`fee\` decimal(8,4) NOT NULL COMMENT '手续费率'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`shares\` \`shares\` decimal(12,4) NOT NULL COMMENT '交易份额'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` CHANGE \`amount\` \`amount\` decimal(10,5) NOT NULL COMMENT '每份交易价格' DEFAULT '0.00000'`);
    }

}
