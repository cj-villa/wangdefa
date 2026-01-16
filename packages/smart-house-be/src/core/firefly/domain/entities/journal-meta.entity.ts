import {Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'journal_meta', comment: 'firefly原数据表', database: 'firefly' })
export class JournalMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_journal_id' })
  transactionJournalId: string;

  @Column()
  // internal_reference
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;

  @Column()
  data: string;

  @Column()
  hash: string;

  @DeleteDateColumn({
    type: 'datetime',
    name: 'deleted_at',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date;
}
