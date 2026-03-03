import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1772519897012 implements MigrationInterface {
    name = 'InitSchema1772519897012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` ADD \`fee\` decimal(10,2) NOT NULL COMMENT '手续费' DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`track_financial\` ADD \`fee\` decimal(10,2) NOT NULL COMMENT '手续费' DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial\` DROP COLUMN \`fee\``);
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` DROP COLUMN \`fee\``);
    }

}
