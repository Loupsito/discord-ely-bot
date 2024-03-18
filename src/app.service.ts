import { Injectable } from '@nestjs/common';
import { MusicPlayerService } from './service/music-player/music-player.service';

@Injectable()
export class AppService {
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
