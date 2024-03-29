import { Injectable } from '@nestjs/common';
import {
  AudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { YoutubeService } from '../youtube/youtube-service.service';
import {
  GENERIC_MESSAGES,
  VOICE_CHANNEL_MESSAGES,
} from '../../discord-messages.type';

@Injectable()
export class VoiceConnectionService {
  private connection: VoiceConnection | null = null;

  constructor(private youtubeService: YoutubeService) {}

  joinAndPlay(voiceChannel: any, url: string, player: AudioPlayer) {
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const stream = this.youtubeService.getStream(url);
    const resource = createAudioResource(stream);
    player.play(resource);
    this.connection.subscribe(player);
  }

  disconnect(message) {
    if (
      this.connection &&
      this.connection.state.status !== VoiceConnectionStatus.Disconnected
    ) {
      this.connection.destroy();
      this.connection = null;
      message.reply(GENERIC_MESSAGES.BYE);
    } else {
      return message.reply(VOICE_CHANNEL_MESSAGES.BOT_MUST_BE_IN_VOICE_CHANNEL);
    }
  }
}
