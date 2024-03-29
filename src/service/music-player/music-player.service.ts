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

    try {
      const url = await this.extractUrlFromMessageContent(message);
      this.voiceConnectionService.joinAndPlay(
        message.member.voice.channel,
        url,
        this.player,
      );
      const videoTitle = await this.youtubeService.getVideoTitle(url);
      return message.reply(`**En cours de lecture :** ${videoTitle}`);
    } catch (error) {
      message.reply(error);
    }
  }

  stop(message: any) {
    this.replyErrorMessageIfNotInVoiceChannel(message);

    if (this.player.state.status !== AudioPlayerStatus.Idle) {
      this.player.stop();
    }
    return message.reply('La musique a été arrêtée.');
  }

  private extractUrlFromMessageContent(message): Promise<string> {
    return new Promise((resolve, reject) => {
      const commands = message.content.split(' ');

      if (commands.length < 2) {
        reject(
          `Il faut fournir une URL Youtube.\n **Exemple :** !play https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        );
      }

      if (!this.youtubeService.isYoutubeUrl(commands[1])) {
        reject('Il faut fournir une URL Youtube');
      }

      resolve(commands[1]);
    });
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
