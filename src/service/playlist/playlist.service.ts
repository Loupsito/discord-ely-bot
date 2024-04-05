import { Injectable } from '@nestjs/common';
import { AudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { GuildService } from '../guild/guild.service';
import { MusicPlayerService } from '../music-player/music-player.service';
import { extractUrlFromMessageContent } from '../../util/music-command.utils';
import { YoutubeService } from '../youtube/youtube-service.service';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class PlaylistService {
  constructor(
    private guildService: GuildService,
    private musicPlayerService: MusicPlayerService,
    private youtubeService: YoutubeService,
    private discordService: DiscordService,
  ) {}

  async addTrackToPlaylist(message) {
    const audioPlayer = this.guildService.getOrCreateAudioPlayer(
      message.guildId,
    );
    const urlTrack = await extractUrlFromMessageContent(message);
    const playlist = this.guildService.getOrCreateToPlaylist(message.guildId);
    const videoTitle = await this.youtubeService.getVideoTitle(urlTrack);

    playlist.queue.push(urlTrack);

    if (!playlist.textChannel) {
      playlist.textChannel = message;
    }

    if (audioPlayer.state.status !== AudioPlayerStatus.Playing) {
      message.reply(
        `Ajout à la playlist de **${videoTitle}** et lancement de la lecture`,
      );
      await this.playNextTrack(message.guildId);
    } else {
      message.reply(`Ajout à la playlist de ${videoTitle}`);
    }
  }

  async playNextTrack(guildId: string) {
    const playlist = this.guildService.getOrCreateToPlaylist(guildId);
    const queue = playlist.queue;
    const audioPlayer = this.guildService.getOrCreateAudioPlayer(guildId);

    if (playlist && queue.length > 0) {
      const nextTrack = queue.shift(); // Récupère et supprime le premier élément de la playlist
      this.attachTrackEndListener(audioPlayer, guildId); // Attache un listener pour jouer le prochain morceau

      await this.musicPlayerService.play(playlist.textChannel, nextTrack);
    }
  }

  private attachTrackEndListener(audioPlayer: AudioPlayer, guildId: string) {
    const playlist = this.guildService.getOrCreateToPlaylist(guildId);
    const queue = playlist.queue;
    audioPlayer.on('stateChange', async (oldState, newState) => {
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        if (queue.length == 0) {
          audioPlayer.removeListener(
            'messageCreate',
            this.attachTrackEndListener,
          );
          this.discordService.sendMessageToChannel(
            playlist.textChannel.channelId,
            'La playlist est vide',
          );
        } else {
          await this.playNextTrack(guildId);
        }
      }
    });
  }
}
