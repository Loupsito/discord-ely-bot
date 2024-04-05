import { Injectable } from '@nestjs/common';
import {
  AudioPlayer,
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';

@Injectable()
export class GuildService {
  private guildMusicPlayers = new Map<string, AudioPlayer>();
  private guildVoiceConnections = new Map<string, VoiceConnection>();

  constructor() {}

  getOrCreateAudioPlayer(guildId: string): AudioPlayer {
    if (!this.guildMusicPlayers.has(guildId)) {
      const audioPlayer = createAudioPlayer();
      this.guildMusicPlayers.set(guildId, audioPlayer);
    }
    return this.guildMusicPlayers.get(guildId);
  }

  getOrCreateVoiceConnection(
    guildId: string,
    channelId: string,
    adapterCreator: any,
  ): VoiceConnection {
    if (!this.guildVoiceConnections.has(guildId)) {
      const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: adapterCreator,
      });
      this.guildVoiceConnections.set(guildId, connection);
    }
    return this.guildVoiceConnections.get(guildId);
  }

  deleteGuildConnection(guildId: string) {
    this.guildVoiceConnections.delete(guildId);
  }
}
