import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767602243976 implements MigrationInterface {
    name = 'InitSchema1767602243976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_name\` varchar(32) NOT NULL COMMENT '用户名', \`email\` varchar(64) NOT NULL COMMENT '邮箱', \`password\` varchar(64) NOT NULL COMMENT '密码', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="用户表"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
