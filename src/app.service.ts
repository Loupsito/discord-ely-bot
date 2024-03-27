import { Injectable } from '@nestjs/common';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { DiscordService } from './service/discord/discord.service';
import { VoiceConnectionService } from './service/voice-connection-service/voice-connection-service.service';

@Injectable()
export class AppService {
  constructor(
    private readonly discordService: DiscordService,
    private musicPlayerService: MusicPlayerService,
    private voiceConnectionService: VoiceConnectionService,
  ) {}

  async onModuleInit() {
    this.discordService.discordClient.on(
      'messageCreate',
      this.handleMessageCreate.bind(this),
    );
  }

  async handleMessageCreate(message) {
    if (!message.guild) {
      return message.reply("Erreur : Vous n'êtes pas dans un serveur.");
    }

    if (message.content.startsWith('!play')) {
      console.log('discord command !play used');
      await this.musicPlayerService.play(message);
    }

    if (message.content.startsWith('!stop')) {
      console.log('discord command !stop used');
      await this.musicPlayerService.stop(message);
    }

    if (message.content.startsWith('!disconnect')) {
      this.voiceConnectionService.disconnect(message);
      return message.reply('Bye bye 👋');
    }
  }
}
