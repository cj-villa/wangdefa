import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769580687762 implements MigrationInterface {
    name = 'InitSchema1769580687762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` ADD \`user_id\` varchar(255) NOT NULL COMMENT '用户Id'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` DROP COLUMN \`user_id\``);
    }

}
