import { randomUUID } from 'crypto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity({ name: 'user', comment: '用户表' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'user_name', comment: '用户名', type: 'varchar', length: 32, unique: true })
  username: string;

  @Column({ name: 'nick_name', comment: '用户别名', type: 'varchar', length: 32 })
  nickName: string;

  @Column({ comment: '邮箱', type: 'varchar', length: 64, unique: true })
  email: string;

  @Column({ comment: '密码', type: 'varchar', length: 256 })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date;

  @BeforeInsert()
  generateInviteCode() {
    if (!this.userId) {
      this.userId = randomUUID();
    }
  }
}
