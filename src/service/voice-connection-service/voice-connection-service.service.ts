import { Injectable } from '@nestjs/common';
import {
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
  AudioPlayer,
  createAudioResource,
} from '@discordjs/voice';
import { YoutubeService } from '../youtube-service/youtube-service.service';

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
    } else {
      return message.reply('Je ne suis actuellement pas dans un canal vocal.');
    }
  }
}
