import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToOne(() => AccountEntity, (acc) => acc.id)
  account: string;
}
