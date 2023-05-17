import { Column, Entity } from 'typeorm';
import { NotUpdateCommon } from './common.entity';

@Entity()
export class VideoDetail extends NotUpdateCommon {
  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  platform: string;

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'en' })
  defaultLanguage: string;
}
