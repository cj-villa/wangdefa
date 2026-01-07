import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767606903681 implements MigrationInterface {
    name = 'InitSchema1767606903681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`user_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_758b8ce7c18b9d347461b30228\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`nick_name\` varchar(32) NOT NULL COMMENT '用户别名'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_d34106f8ec1ebaf66f4f8609dd\` (\`user_name\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_d34106f8ec1ebaf66f4f8609dd\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`nick_name\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_758b8ce7c18b9d347461b30228\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`user_id\``);
    }

}
