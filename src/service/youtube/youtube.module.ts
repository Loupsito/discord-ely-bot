import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube-service.service';

@Module({
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}
