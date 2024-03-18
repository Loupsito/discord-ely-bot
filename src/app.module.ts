import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DiscordConfigService } from './service/discord-config/discord-config.service';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { DiscordHandleCommandsService } from './service/discord-handle-commands/discord-handle-commands.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [],
  providers: [DiscordConfigService, MusicPlayerService, DiscordHandleCommandsService],
})
export class AppModule {}
