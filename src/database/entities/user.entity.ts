import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Common } from './common.entity';

@Entity()
export class User extends Common {
  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  nickname: string;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  age: Date;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  job: string;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '미정' })
  refreshToken: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '미정' })
  profileImage: string;
}
