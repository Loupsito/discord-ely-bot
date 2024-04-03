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
  private guildVoiceConnections = new Map<string, VoiceConnection>();

  constructor(private youtubeService: YoutubeService) {}

  joinAndPlay(message: any, url: string, player: AudioPlayer) {
    const guildConnection = this.getOrCreateGuildVoiceConnection(message);
    const stream = this.youtubeService.getStream(url);
    const resource = createAudioResource(stream);
    player.play(resource);
    guildConnection.subscribe(player);
  }

  disconnect(message) {
    const guildConnection = this.getOrCreateGuildVoiceConnection(message);
    if (
      guildConnection &&
      guildConnection.state.status !== VoiceConnectionStatus.Disconnected
    ) {
      guildConnection.destroy();
      this.deleteGuildConnection(message.guildId);
      message.reply(GENERIC_MESSAGES.BYE);
    } else {
      return message.reply(VOICE_CHANNEL_MESSAGES.BOT_MUST_BE_IN_VOICE_CHANNEL);
    }
  }

  private getOrCreateGuildVoiceConnection(message) {
    if (!this.guildVoiceConnections.has(message.guildId)) {
      const voiceChannel = message.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      this.guildVoiceConnections.set(message.guildId, connection);
    }
    return this.guildVoiceConnections.get(message.guildId);
  }

  private deleteGuildConnection(guildId: string) {
    this.guildVoiceConnections.delete(guildId);
  }
}
