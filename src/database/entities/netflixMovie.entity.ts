import { Column, Entity } from 'typeorm';
import { NotUpdateCommon } from './common.entity';

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
}
