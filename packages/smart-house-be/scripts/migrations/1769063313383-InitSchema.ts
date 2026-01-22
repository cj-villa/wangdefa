import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769063313383 implements MigrationInterface {
    name = 'InitSchema1769063313383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`user_name\` varchar(32) NOT NULL COMMENT '用户名', \`nick_name\` varchar(32) NOT NULL COMMENT '用户别名', \`email\` varchar(64) NOT NULL COMMENT '邮箱', \`password\` varchar(256) NOT NULL COMMENT '密码', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_758b8ce7c18b9d347461b30228\` (\`user_id\`), UNIQUE INDEX \`IDX_d34106f8ec1ebaf66f4f8609dd\` (\`user_name\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="用户表"`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(32) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL COMMENT '三方调用token', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_d9959ee7e17e2293893444ea37\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="token表"`);
        await queryRunner.query(`CREATE TABLE \`firefly_parsing_rules\` (\`id\` varchar(36) NOT NULL, \`type\` varchar(255) NOT NULL COMMENT '解析后的字段类型', \`analysis_type\` varchar(255) NOT NULL COMMENT '解析后对应的字段类型，如：可以从鸡公煲解析出预算为午饭', \`user_id\` varchar(255) NOT NULL COMMENT '该字段使用的用户', \`source\` varchar(256) NOT NULL COMMENT '解析前的内容', \`target\` varchar(256) NOT NULL COMMENT '解析后的内容', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="firefly解析规则表"`);
        await queryRunner.query(`CREATE TABLE \`track_fund\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(32) NOT NULL COMMENT '基金的名称', \`code\` varchar(32) NOT NULL COMMENT '基金编码', \`user_id\` varchar(255) NOT NULL COMMENT '绑定的用户', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`idx_code_user_id\` (\`code\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="正在追踪的基金记录表"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_code_user_id\` ON \`track_fund\``);
        await queryRunner.query(`DROP TABLE \`track_fund\``);
        await queryRunner.query(`DROP TABLE \`firefly_parsing_rules\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9959ee7e17e2293893444ea37\` ON \`token\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_d34106f8ec1ebaf66f4f8609dd\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_758b8ce7c18b9d347461b30228\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
