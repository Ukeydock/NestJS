import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Common, NotUpdateCommon } from './common.entity';
import { Video } from './video.entity';
import { User } from './user.entity';

@Entity({ name: `keyword` })
export class Keyword extends NotUpdateCommon {
  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  keyword: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  count: number;
}

@Entity({ name: 'keywordUser' })
export class KeywordUser extends NotUpdateCommon {
  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Keyword, (keyword) => keyword.id, {
    cascade: true,
  })
  @JoinColumn()
keyword: Keyword;

  @Column({ type: 'tinyint', nullable: false, default: 0 })
  isMain: boolean;
}

@Entity({ name: 'keywordVideo' })
export class KeywordVideo extends NotUpdateCommon {
  @ManyToOne(() => Video, (video) => video.id, { cascade: true })
  @JoinColumn()
  video: Video;

  @ManyToOne(() => Keyword, (keyword) => keyword.id, { cascade: true })
  @JoinColumn()
  keyword: Keyword;
}
