import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AppService } from './app.service';
import { VoiceConnectionService } from './service/voice-connection/voice-connection-service.service';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './service/discord/discord.module';
import { HelpService } from './service/help/help.service';
import { YoutubeModule } from './service/youtube/youtube.module';
import { GuildModule } from './service/guild/guild.module';
import { GuildService } from './service/guild/guild.service';
import { PlaylistService } from './service/playlist/playlist.service';
import { PlaylistModule } from './service/playlist/playlist.module';
import { AudioPlayerService } from './service/audio-player/audio-player.service';

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot(),
    DiscordModule,
    YoutubeModule,
    GuildModule,
    PlaylistModule,
  ],
  providers: [
    AppService,
    VoiceConnectionService,
    HelpService,
    GuildService,
    PlaylistService,
    AudioPlayerService,
  ],
})
export class AppModule {}
