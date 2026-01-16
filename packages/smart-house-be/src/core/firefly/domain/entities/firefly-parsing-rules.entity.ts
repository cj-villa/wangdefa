import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { type JournalFieldType } from '../../application/enum/journal-field-type';
import { type BillFieldType } from '../../application/enum/bill-field-type';

@Entity({ name: 'firefly_parsing_rules', comment: 'firefly解析规则表' })
export class FireflyParsingRules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', comment: '解析后的字段类型' })
  type: JournalFieldType;

  @Column({
    name: 'analysis_type',
    type: 'varchar',
    comment: '解析后对应的字段类型，如：可以从鸡公煲解析出预算为午饭',
  })
  analysisType: BillFieldType;

  @Column({ name: 'user_id', type: 'uuid', comment: '该字段使用的用户' })
  userId: string;

  @Column({ type: 'varchar', length: '256', comment: '解析前的内容' })
  source: string;

  @Column({ type: 'varchar', length: '256', comment: '解析后的内容' })
  target: string;

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
