import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767691733700 implements MigrationInterface {
    name = 'InitSchema1767691733700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL COMMENT '三方调用token', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_e50ca89d635960fda2ffeb1763\` (\`user_id\`), UNIQUE INDEX \`IDX_d9959ee7e17e2293893444ea37\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="token表"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_d9959ee7e17e2293893444ea37\` ON \`token\``);
        await queryRunner.query(`DROP INDEX \`IDX_e50ca89d635960fda2ffeb1763\` ON \`token\``);
        await queryRunner.query(`DROP TABLE \`token\``);
    }

}
