import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Common, CommonSoftDelete } from './common.entity';
import { User } from './user.entity';

@Entity()
export class Auth extends CommonSoftDelete {
  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  snsId: string;

  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  email: string;

  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'local' })
  platform: string;
}
