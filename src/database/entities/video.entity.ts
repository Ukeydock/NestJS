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
import { Keyword } from './keyword.entity';
import { User } from './user.entity';
import { VideoDetail } from './videoDetail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: `video` })
export class Video extends Common {
  @Column({ type: 'varchar', length: 128, nullable: false, default: '미정' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '미정' })
  thumbnail: Date;

  @ApiProperty({
    example: '3600',
    default: '7200',
    description: '영상길이(초단위)',
    required: false,
  })
  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  duration: string;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  createdDate: string;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  videoId: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  commentCount: number;

  @Column({ type: 'int', default: 0 })
  libraryCount: number;

  @ManyToOne(() => VideoDetail, (videoDetail) => videoDetail.id, {
    cascade: true,
  })
  @JoinColumn([{ name: 'videoDetailId', referencedColumnName: 'id' }])
  videoDetail: VideoDetail;
}

@Entity({ name: 'library' })
export class VideoUser extends NotUpdateCommon {
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user;

  @OneToOne(() => Video, (video) => video.id, { cascade: true })
  @JoinColumn()
  video;
}
