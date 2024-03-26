import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import { MusicPlayerService } from '../music-player/music-player.service';
import { AppService } from '../../app.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordConfigService implements OnModuleInit {
  constructor(
    private discordHandleCommandsService: AppService,
    private configService: ConfigService,
  ) {}

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

    const token = this.configService.get<string>('DISCORD_TOKEN');
    await this.client.login(token);
  }
}
