import { Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';

@Injectable()
export class MusicPlayerService {
  private connection: VoiceConnection | null = null;
  private player = createAudioPlayer();

  async play(message: any) {
    const url = this.extractUrlFromMessageContent(message.content);

    const voiceChannel = message.member.voice.channel;
    if (voiceChannel) {
      this.joinVoiceChannelAndPlayAudio(voiceChannel, url);
      const videoTitle = await this.getVideoTitle(url);
      return message.reply(`En cours de lecture : ${videoTitle}`);
    } else {
      return message.reply(
        'Vous devez être dans un canal vocal pour jouer de la musique.',
      );
    }
  }

  async stop(message: any) {
    if (!message.guild)
      return message.reply("Erreur : Vous n'êtes pas dans un serveur.");

    this.stopPlayerIfPlaying();
    this.disconnectVoiceConnectionIfConnected(message);
    return message.reply('La musique a été arrêtée.');
  }

  private extractUrlFromMessageContent(content: string): string {
    const commands = content.split(' ');
    if (commands.length < 2) {
      throw new Error('Missing URL argument for play command');
    }
    return commands[1];
  }

  private joinVoiceChannelAndPlayAudio(voiceChannel: any, url: string) {
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    this.player.play(resource);
    this.connection.subscribe(this.player);
  }

  async getVideoTitle(url) {
    try {
      const info = await ytdl.getInfo(url);
      return info.videoDetails.title;
    } catch (error) {
      console.error('Error fetching video title:', error);
      return null;
    }
  }

  private disconnectVoiceConnectionIfConnected(message) {
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

  private stopPlayerIfPlaying() {
    if (this.player.state.status !== AudioPlayerStatus.Idle) {
      this.player.stop();
    }
  }
}
