import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769152997546 implements MigrationInterface {
    name = 'InitSchema1769152997546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund\` DROP COLUMN \`channel\``);
        await queryRunner.query(`ALTER TABLE \`track_fund\` ADD \`channel\` enum ('icbc_financial', 'cmb_financial', 'cmb_fund') NOT NULL COMMENT '基金的购买渠道'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_fund\` DROP COLUMN \`channel\``);
        await queryRunner.query(`ALTER TABLE \`track_fund\` ADD \`channel\` varchar(16) NOT NULL COMMENT '基金的购买渠道'`);
    }

}
