import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import { MusicPlayerService } from '../music-player/music-player.service';
import { DiscordHandleCommandsService } from '../discord-handle-commands/discord-handle-commands.service';

@Injectable()
export class DiscordConfigService implements OnModuleInit {
  constructor(private musicPlayerService: MusicPlayerService, private discordHandleCommandsService: DiscordHandleCommandsService) {}

  private readonly client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent, // Nécessaire pour accéder à message.content
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  async onModuleInit() {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on(
      'messageCreate',
      this.discordHandleCommandsService.handleMessageCreate.bind(this),
    );

    await this.client.login(
      'token',
    );
  }
}
