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
    const url = this.extractUrlFromMessageContent(message.content);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply(
        'Vous devez être dans un canal vocal pour jouer de la musique.',
      );
    }

    const videoTitle = await this.youtubeService.getVideoTitle(url);
    this.voiceConnectionService.joinAndPlay(voiceChannel, url, this.player);

    return message.reply(`**En cours de lecture :** ${videoTitle}`);
  }

  stop(message: any) {
    if (!message.guild)
      return message.reply("Erreur : Vous n'êtes pas dans un serveur.");

    if (this.player.state.status !== AudioPlayerStatus.Idle) {
      this.player.stop();
    }
    this.voiceConnectionService.disconnect(message);
    return message.reply('La musique a été arrêtée.');
  }

  private extractUrlFromMessageContent(content: string): string {
    const commands = content.split(' ');
    if (commands.length < 2) {
      throw new Error('Missing URL argument for play command');
    }
    return commands[1];
  }
}
