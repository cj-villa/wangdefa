import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'token', comment: 'token表' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 32 })
  name: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ comment: '三方调用token', type: 'uuid', unique: true })
  token: string;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6 })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date;
}
