import { Module } from '@nestjs/common';
import { VideoService } from './services/video.service';
import { VideoController } from './controllers/video.controller';
import { ViewController } from './controllers/view.controller';
import { MovieController } from './controllers/movie.controller';

@Module({
  controllers: [VideoController, ViewController, MovieController],
  providers: [VideoService],
})
export class VideoModule {}
