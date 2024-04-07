import { Injectable } from '@nestjs/common';
import {
  AudioPlayer,
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';

export interface Playlist {
  textChannel: any;
  queue: Music[];
  currentlyPlaying: Music;
  isPaused: boolean;
}

export interface Music {
  url: string;
  title: string;
}

@Injectable()
export class GuildService {
  private guildMusicPlayers = new Map<string, AudioPlayer>();
  private guildVoiceConnections = new Map<string, VoiceConnection>();
  private guildPlaylists = new Map<string, Playlist>();

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

  getOrCreatePlaylist(guildId: string) {
    if (!this.guildPlaylists.has(guildId)) {
      const newPlaylist: Playlist = {
        textChannel: null,
        queue: [],
        currentlyPlaying: null,
        isPaused: false,
      };
      this.guildPlaylists.set(guildId, newPlaylist);
    }
    return this.guildPlaylists.get(guildId);
  }
}
