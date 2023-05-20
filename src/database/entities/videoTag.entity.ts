import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Common, NotUpdateCommon } from './common.entity';
import { Video } from './video.entity';

@Entity({ name: 'videoTag' })
export class VideoTag extends NotUpdateCommon {
  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  tag: string;
}

@Entity({ name: 'videoTagVideo' })
export class VideoTagVideo extends Common {
  @ManyToOne(() => VideoTag, (videoTag) => videoTag.id, {
    cascade: true,
  })
  @JoinColumn([{ name: 'videoTagId', referencedColumnName: 'id' }])
  videoTag: VideoTag;

  @ManyToOne(() => Video, (video) => video.id, {
    cascade: true,
  })
  @JoinColumn([{ name: 'videoId', referencedColumnName: 'id' }])
  video: Video;
}
