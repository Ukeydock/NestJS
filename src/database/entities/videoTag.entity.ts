import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Common, NotUpdateCommon } from './common.entity';
import { Video } from './video.entity';

@Entity()
export class VideoTag extends NotUpdateCommon {
  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  tag: string;
}

export class VideoTagVideo extends Common {
  @OneToMany(() => VideoTag, (videoTag) => videoTag.id, {
    cascade: true,
  })
  @JoinColumn([{ name: 'videoTagId', referencedColumnName: 'id' }])
  @Column({ type: 'bigint', nullable: false })
  videoTag: VideoTag;

  @OneToMany(() => Video, (video) => video.id, {
    cascade: true,
  })
  @JoinColumn([{ name: 'videoId', referencedColumnName: 'id' }])
  @Column({ type: 'bigint', nullable: false })
  video: Video;
}
