import { Injectable } from '@nestjs/common';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  VoiceConnection,
} from '@discordjs/voice';
import { YoutubeService } from '../youtube-service/youtube-service.service';
import { VoiceConnectionService } from '../voice-connection-service/voice-connection-service.service';

@Injectable()
export class MusicPlayerService {
  private connection: VoiceConnection | null = null;
  private player = createAudioPlayer();

  constructor(
    private voiceConnectionService: VoiceConnectionService,
    private youtubeService: YoutubeService,
  ) {}

  async play(message: any) {
    this.replyErrorMessageIfNotInVoiceChannel(message);

    const url = this.extractUrlFromMessageContent(message.content);
    this.voiceConnectionService.joinAndPlay(
      message.member.voice.channel,
      url,
      this.player,
    );

    const videoTitle = await this.youtubeService.getVideoTitle(url);
    return message.reply(`**En cours de lecture :** ${videoTitle}`);
  }

  stop(message: any) {
    this.replyErrorMessageIfNotInVoiceChannel(message);

    if (this.player.state.status !== AudioPlayerStatus.Idle) {
      this.player.stop();
    }
    return message.reply('La musique a été arrêtée.');
  }

  private extractUrlFromMessageContent(content: string): string {
    const commands = content.split(' ');
    if (commands.length < 2) {
      throw new Error('Missing URL argument for play command');
    }
    return commands[1];
  }

  private replyErrorMessageIfNotInVoiceChannel(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply(
        'Vous devez être dans un canal vocal pour utiliser cette commande',
      );
    }
  }
}
