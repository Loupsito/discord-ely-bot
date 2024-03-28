import { Injectable } from '@nestjs/common';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { DiscordService } from './service/discord/discord.service';
import { VoiceConnectionService } from './service/voice-connection-service/voice-connection-service.service';
import { COMMANDS } from './discord-command.type';
import { logCommand } from './infrastructure/discord-commands.interceptor';

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
    const commandActions = {
      [COMMANDS.PLAY.trigger]: () => this.musicPlayerService.play(message),
      [COMMANDS.STOP.trigger]: () => this.musicPlayerService.stop(message),
      [COMMANDS.DISCONNECT.trigger]: () =>
        this.voiceConnectionService.disconnect(message),
    };

    const command = message.content.split(' ')[0];
    const action = commandActions[command];

    if (action) {
      logCommand(command, message);
      await action();
    }
  }
}
