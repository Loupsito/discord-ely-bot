import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
  }

  get discordClient(): Client {
    return this.client;
  }

  async onModuleInit() {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    const token = this.configService.get<string>('DISCORD_TOKEN');
    await this.client.login(token);
  }
}
