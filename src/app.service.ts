import { Injectable } from '@nestjs/common';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { DiscordService } from './service/discord/discord.service';
import { VoiceConnectionService } from './service/voice-connection-service/voice-connection-service.service';
import { COMMANDS } from './discord-command.type';
import { MESSAGES } from './discord-messages.type';

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
      return message.reply(MESSAGES.NOT_IN_SERVER);
    }

    const command = message.content.split(' ')[0]; // Prendre la première partie de la commande

    switch (command) {
      case COMMANDS.PLAY:
        console.log('discord command !play used');
        await this.musicPlayerService.play(message);
        break;
      case COMMANDS.STOP:
        console.log('discord command !stop used');
        await this.musicPlayerService.stop(message);
        break;
      case COMMANDS.DISCONNECT:
        this.voiceConnectionService.disconnect(message);
        message.reply(MESSAGES.BYE);
        break;
      default:
        break;
    }
  }
}
