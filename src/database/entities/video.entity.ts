import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Common } from './common.entity';
import { Keyword } from './keyword.entity';
import { User } from './user.entity';

@Entity()
export class Video extends Common {
  @Column({ type: 'varchar', length: 64, nullable: false, default: '미정' })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '미정' })
  thumbnail: Date;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  duration: string;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  createdDate: string;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  videoId: string;

  @Column({ type: 'varchar', length: 32, nullable: false, default: 'youtube' })
  platform: string;
}

@Entity({ name: 'Library' })
export class VideoUser extends Common {
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user;

  @OneToOne(() => Video, (video) => video.id, { cascade: true })
  @JoinColumn()
  video;
}
