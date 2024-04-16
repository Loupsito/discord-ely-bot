import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { GuildService } from '../guild/guild.service';

@Injectable()
export class DiscordService implements OnModuleInit {
  private logger = new Logger('DiscordService');
  private readonly client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly guildService: GuildService,
  ) {
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

  async sendMessageToChannel(channelId, messageText) {
    try {
      const channel = await this.client.channels.fetch(channelId);

      // Vérifier que le canal est un TextChannel ou DMChannel avant d'envoyer un message
      if (channel instanceof TextChannel) {
        await channel.send(messageText);
      } else {
        console.error("Le canal trouvé n'est pas un canal de texte.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du canal ou de l'envoi du message:", error);
    }
  }

  async onModuleInit() {
    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user.tag}!`);
    });

    const token = this.configService.get<string>('DISCORD_TOKEN');
    await this.client.login(token);
  }
}
