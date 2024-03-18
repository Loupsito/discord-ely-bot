import { Injectable } from '@nestjs/common';
import { MusicPlayerService } from '../music-player/music-player.service';

@Injectable()
export class DiscordHandleCommandsService {
  constructor(private musicPlayerService: MusicPlayerService) {}

  async handleMessageCreate(message) {
    if (!message.guild) return;

    if (message.content.startsWith('!play')) {
      await this.musicPlayerService.play(message);
    }

    if (message.content.startsWith('!stop')) {
      await this.musicPlayerService.stop(message);
    }
  }
}
