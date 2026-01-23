import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769152889453 implements MigrationInterface {
    name = 'InitSchema1769152889453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` DROP COLUMN \`fee\``);
        await queryRunner.query(`ALTER TABLE \`track_fund\` ADD \`channel\` varchar(16) NOT NULL COMMENT '基金的购买渠道'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund\` DROP COLUMN \`channel\``);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` ADD \`fee\` decimal(5,2) NOT NULL COMMENT '手续费率' DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`track_fund_transaction\` ADD \`amount\` decimal NOT NULL COMMENT '每份交易价格' DEFAULT '0.00000000'`);
    }

}
