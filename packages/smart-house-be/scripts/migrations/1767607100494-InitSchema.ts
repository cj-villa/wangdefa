import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767607100494 implements MigrationInterface {
    name = 'InitSchema1767607100494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(256) NOT NULL COMMENT '密码'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(64) NOT NULL COMMENT '密码'`);
    }

}
