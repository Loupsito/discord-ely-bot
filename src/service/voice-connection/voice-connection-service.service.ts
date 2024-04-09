import { Injectable } from '@nestjs/common';
import {
  AudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { YoutubeService } from '../youtube/youtube-service.service';
import {
  GENERIC_MESSAGES,
  VOICE_CHANNEL_MESSAGES,
} from '../../type/discord-messages.type';
import { GuildService } from '../guild/guild.service';

@Injectable()
export class VoiceConnectionService {
  constructor(
    private youtubeService: YoutubeService,
    private guildService: GuildService,
  ) {}

  joinAndPlay(message: any, url: string, player: AudioPlayer) {
    const voiceConnection =
      this.guildService.getOrCreateVoiceConnection(message);
    const stream = this.youtubeService.getStream(url);
    const resource = createAudioResource(stream);
    player.play(resource);
    voiceConnection.subscribe(player);
  }

  disconnect(message) {
    const voiceConnection =
      this.guildService.getOrCreateVoiceConnection(message);

    if (
      voiceConnection &&
      voiceConnection.state.status !== VoiceConnectionStatus.Disconnected
    ) {
      voiceConnection.destroy();
      this.guildService.purgeAll(message.guildId);
      message.reply(GENERIC_MESSAGES.BYE);
    } else {
      return message.reply(VOICE_CHANNEL_MESSAGES.BOT_MUST_BE_IN_VOICE_CHANNEL);
    }
  }
}
