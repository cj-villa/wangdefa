import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1772520818510 implements MigrationInterface {
    name = 'InitSchema1772520818510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial\` DROP COLUMN \`fee\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial\` ADD \`fee\` decimal NOT NULL COMMENT '手续费' DEFAULT '0.00'`);
    }

}
