import { Module } from '@nestjs/common';
import { VideoService } from './services/video.service';
import { VideoController } from './controllers/video.controller';
import { VideoUserController } from './controllers/videoUserView.controller';
import { MovieController } from './controllers/movie.controller';
import { CommonModule } from '../common/common.module';
import {
  FindVideoDetailQueryBuilder,
  VideoRepository,
} from './repositories/video.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video, VideoUser } from '@root/database/entities/video.entity';
import { VideoDetail } from '@root/database/entities/videoDetail.entity';
import {
  VideoTag,
  VideoTagVideo,
} from '@root/database/entities/videoTag.entity';
import { VideoTagRepository } from './repositories/videoTag.repository';
import { VideoUserRepository } from './repositories/videoUserView.repository';
import { VideoUserService } from './services/videoUserView.service';
import { View } from '@root/database/entities/view.entity';
import { VideoListQueryBuilder, VideoListQueryBuilderForView } from './repositories/queryBuilder/videoListQueryBuilder';
import { KeywordRepository } from '../keyword/repositories/keyword.repository';
import { Keyword } from '@root/database/entities/keyword.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Video, VideoDetail, VideoTag, VideoTagVideo, VideoUser, View, Keyword]),
  ],
  controllers: [VideoController, VideoUserController, MovieController],
  providers: [
    VideoService,
    VideoUserService,


    KeywordRepository,
    VideoRepository,
    VideoTagRepository,
    VideoUserRepository,

    VideoListQueryBuilder,
    FindVideoDetailQueryBuilder,
    VideoListQueryBuilderForView,
    
  ],
  exports: [
    VideoService,
    VideoTagRepository,
    TypeOrmModule.forFeature([Video, VideoDetail, VideoTag, VideoTagVideo]),
  ],
})
export class VideoModule { }
