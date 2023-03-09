import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => AccountEntity, (acc) => acc)
  fromUserId: string;

  @ManyToOne(() => AccountEntity, (acc) => acc)
  toUserId: string;
}
