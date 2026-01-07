import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767692625034 implements MigrationInterface {
    name = 'InitSchema1767692625034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e50ca89d635960fda2ffeb1763\` ON \`token\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e50ca89d635960fda2ffeb1763\` ON \`token\` (\`user_id\`)`);
    }

}
