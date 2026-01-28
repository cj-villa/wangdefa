import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769581833529 implements MigrationInterface {
    name = 'InitSchema1769581833529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`shares\` \`shares\` decimal(10,2) NOT NULL COMMENT '交易份额'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`track_financial_transaction\` CHANGE \`shares\` \`shares\` decimal(10,0) NOT NULL COMMENT '交易份额'`);
    }

}
