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
import { AudioPlayerModule } from './service/audio-player/audio-player.module';

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot(),
    DiscordModule,
    YoutubeModule,
    GuildModule,
    AudioPlayerModule,
  ],
  providers: [
    AppService,
    VoiceConnectionService,
    HelpService,
    GuildService,
    PlaylistService,
  ],
})
export class AppModule {}
