import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Common, CommonSoftDelete } from './common.entity';

@Entity({ name: `user` })
export class User extends CommonSoftDelete {
  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  nickname: string;

  @Column({ type: 'varchar', length: 32, nullable: true, default: '미정' })
  birthday: Date;

  @Column({ type: 'varchar', length: 32, nullable: true, default: '미정' })
  job: string;

  @Column({ type: 'varchar', length: 32, nullable: true, default: '미정' })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '미정' })
  refreshToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '미정' })
  profileImage: string;
}
