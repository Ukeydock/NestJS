import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Common } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Auth extends Common {
  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  snsId: string;

  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  email: string;

  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user;

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'local' })
  platform: string;
}
