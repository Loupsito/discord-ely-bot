import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { AppService } from './app.service';
import { VoiceConnectionService } from './service/voice-connection-service/voice-connection-service.service';
import { YoutubeService } from './service/youtube-service/youtube-service.service';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './service/discord/discord.module';

@Module({
  imports: [DiscoveryModule, ConfigModule.forRoot(), DiscordModule],
  providers: [
    MusicPlayerService,
    AppService,
    VoiceConnectionService,
    YoutubeService,
  ],
})
export class AppModule {}
