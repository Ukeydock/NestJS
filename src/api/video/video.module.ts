import { Module } from '@nestjs/common';
import { VideoService } from './services/video.service';
import { VideoController } from './controllers/video.controller';
import { ViewController } from './controllers/view.controller';
import { MovieController } from './controllers/movie.controller';
import { CommonModule } from '../common/common.module';
import { VideoRepository } from './repositories/video.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '@root/database/entities/video.entity';
import { VideoDetail } from '@root/database/entities/videoDetail.entity';
import {
  VideoTag,
  VideoTagVideo,
} from '@root/database/entities/videoTag.entity';
import { VideoTagRepository } from './repositories/videoTag.repository';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Video, VideoDetail, VideoTag, VideoTagVideo]),
  ],
  controllers: [VideoController, ViewController, MovieController],
  providers: [VideoService, VideoRepository, VideoTagRepository],
})
export class VideoModule {}
