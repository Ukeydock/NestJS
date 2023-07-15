import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  Common,
  CommonSoftDelete,
  CommonSoftDeleteNotUpdated,
  NotUpdateCommon,
} from './common.entity';
import { Video } from './video.entity';
import { User } from './user.entity';

@Entity({ name: `videoUserView` })
export class View extends CommonSoftDeleteNotUpdated {
  @ManyToOne(() => Video, (video) => video.id, { cascade: true })
  @JoinColumn({ name: 'videoId' })
  video : Video;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'isRecently', default: true })
  isRecently: boolean;

}
