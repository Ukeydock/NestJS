import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { NotUpdateCommon } from './common.entity';
import { Keyword } from './keyword.entity';

@Entity({ name: `movie` })
export class Movie extends NotUpdateCommon {
  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  name: string;

  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  description: string;

  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  originalName: string;

  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  originalLanguage: string;

  @Column({ type: 'tinyint', default: 0 })
  isExistVideo: boolean;

  @OneToOne(() => Keyword, (keyword) => keyword.id, { cascade: true })
  @JoinColumn()
  keyword: Keyword;
}
