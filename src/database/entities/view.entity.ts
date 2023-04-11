import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common, NotUpdateCommon } from './common.entity';
import { Video } from './video.entity';
import { User } from './user.entity';

@Entity()
export class View extends NotUpdateCommon {
  @ManyToOne(() => Video, (video) => video.id, { cascade: true })
  @JoinColumn()
  video;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user;
}