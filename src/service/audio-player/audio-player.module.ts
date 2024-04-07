import { Module } from '@nestjs/common';
import { VoiceConnectionService } from '../voice-connection/voice-connection-service.service';
import { YoutubeModule } from '../youtube/youtube.module';
import { GuildModule } from '../guild/guild.module';
import { DiscordModule } from '../discord/discord.module';
import { AudioPlayerService } from './audio-player.service';
import { GuildService } from '../guild/guild.service';
import { PlaylistService } from '../playlist/playlist.service';

@Module({
  imports: [YoutubeModule, GuildModule, DiscordModule],
  providers: [
    VoiceConnectionService,
    AudioPlayerService,
    GuildService,
    PlaylistService,
  ],
  exports: [AudioPlayerService],
})
export class AudioPlayerModule {}
