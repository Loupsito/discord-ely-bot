import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { AppService } from './app.service';
import { VoiceConnectionService } from './service/voice-connection/voice-connection-service.service';
import { YoutubeService } from './service/youtube/youtube-service.service';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './service/discord/discord.module';
import { HelpService } from './service/help/help.service';

@Module({
  imports: [DiscoveryModule, ConfigModule.forRoot(), DiscordModule],
  providers: [
    MusicPlayerService,
    AppService,
    VoiceConnectionService,
    YoutubeService,
    HelpService,
  ],
})
export class AppModule {}
