import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { ConfigModule } from '@nestjs/config';
import { GuildModule } from '../guild/guild.module';

@Module({
  imports: [ConfigModule, GuildModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
