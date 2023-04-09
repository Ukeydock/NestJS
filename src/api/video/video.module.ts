import { Module } from '@nestjs/common';
import { VideoService } from './services/video.service';
import { VideoController } from './controllers/video.controller';

@Module({
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
