import { Module } from '@nestjs/common';
import { YoutubeModule } from '../youtube/youtube.module';
import { GuildModule } from '../guild/guild.module';
import { DiscordModule } from '../discord/discord.module';
import { AudioPlayerService } from '../audio-player/audio-player.service';
import { GuildService } from '../guild/guild.service';
import { PlaylistService } from './playlist.service';
import { VoiceConnectionService } from '../voice-connection/voice-connection-service.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [YoutubeModule, GuildModule, DiscordModule],
  providers: [
    AudioPlayerService,
    GuildService,
    PlaylistService,
    VoiceConnectionService,
    ConfigService,
  ],
  exports: [PlaylistService],
})
export class PlaylistModule {}
