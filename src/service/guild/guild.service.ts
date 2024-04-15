import { Injectable } from '@nestjs/common';
import {
  AudioPlayer,
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import { Playlist } from '../../type/playlist.type';

@Injectable()
export class GuildService {
  private guildAudioPlayers = new Map<string, AudioPlayer>();
  private guildVoiceConnections = new Map<string, VoiceConnection>();
  private guildPlaylists = new Map<string, Playlist>();
  private guildChannelIdWhereBotInvoked = new Map<string, string>();

  getOrCreateAudioPlayer(guildId: string): AudioPlayer {
    if (!this.guildAudioPlayers.has(guildId)) {
      const audioPlayer = createAudioPlayer();
      this.guildAudioPlayers.set(guildId, audioPlayer);
    }
    return this.guildAudioPlayers.get(guildId);
  }

  getOrCreateVoiceConnection(message): VoiceConnection {
    if (!this.guildVoiceConnections.has(message.guildId)) {
      const channelId = message.member.voice.channel.id;
      const guildId = message.guildId;
      const adapterCreator =
        message.member.voice.channel.guild.voiceAdapterCreator;

      const connection = joinVoiceChannel({
        channelId,
        guildId: message.guildId,
        adapterCreator,
      });
      this.guildVoiceConnections.set(guildId, connection);
    }
    return this.guildVoiceConnections.get(message.guildId);
  }

  getVoiceConnection(guildId: string): VoiceConnection {
    return this.guildVoiceConnections.get(guildId);
  }

  getOrCreatePlaylist(guildId: string) {
    if (!this.guildPlaylists.has(guildId)) {
      const newPlaylist: Playlist = {
        textChannel: null,
        queue: [],
        currentlyPlaying: null,
        isPaused: false,
        isMarkedAsEmpty: true,
        isListenerAttached: false,
      };
      this.guildPlaylists.set(guildId, newPlaylist);
    }
    return this.guildPlaylists.get(guildId);
  }

  getChannelIdWhereBotInvoked(guildId: string): string {
    return this.guildChannelIdWhereBotInvoked.get(guildId);
  }

  storeChannelIdWhereBotInvoked(guildId: string, channelId: string) {
    this.guildChannelIdWhereBotInvoked.set(guildId, channelId);
  }

  purgeAll(guildId: string) {
    this.guildVoiceConnections.delete(guildId);
    this.guildPlaylists.delete(guildId);
    this.guildAudioPlayers.delete(guildId);
    this.guildChannelIdWhereBotInvoked.delete(guildId);
  }
}
