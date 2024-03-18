import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DiscordConfigService } from './service/discord-config/discord-config.service';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { AppService } from './app.service';
import { VoiceConnectionService } from './service/voice-connection-service/voice-connection-service.service';
import { YoutubeService } from './service/youtube-service/youtube-service.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [],
  providers: [
    DiscordConfigService,
    MusicPlayerService,
    AppService,
    VoiceConnectionService,
    YoutubeService,
  ],
})
export class AppModule {}
