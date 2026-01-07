import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767750146563 implements MigrationInterface {
    name = 'InitSchema1767750146563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`name\` varchar(32) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`name\``);
    }

}
