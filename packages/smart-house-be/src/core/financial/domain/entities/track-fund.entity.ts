import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'track_fund', comment: '正在追踪的基金记录表' })
@Index('idx_code_user_id', ['code', 'userId'], { unique: true })
export class TrackFund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, comment: '基金的名称' })
  name: string;

  @Column({ type: 'varchar', length: 32, comment: '基金编码' })
  code: string;

  @Column({ name: 'user_id', type: 'uuid', comment: '绑定的用户' })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    name: 'deleted_at',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date;
}
