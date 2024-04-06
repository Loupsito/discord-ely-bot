import { Injectable } from '@nestjs/common';
import { AudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { GuildService } from '../guild/guild.service';
import { MusicPlayerService } from '../music-player/music-player.service';
import {
  buildMessageToShowPlaylist,
  extractUrlFromMessageContent,
} from '../../util/music-command.utils';
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
    const playlist = this.guildService.getOrCreatePlaylist(message.guildId);
    const videoTitle = await this.youtubeService.getVideoTitle(urlTrack);

    playlist.queue.push({
      url: urlTrack,
      title: videoTitle,
    });

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
    const playlist = this.guildService.getOrCreatePlaylist(guildId);
    const queue = playlist.queue;
    const audioPlayer = this.guildService.getOrCreateAudioPlayer(guildId);

    if (playlist && queue.length > 0) {
      const currentTrack = queue[0];
      playlist.currentlyPlaying = currentTrack;
      this.attachTrackEndListener(audioPlayer, guildId);

      await this.musicPlayerService.play(
        playlist.textChannel,
        currentTrack.url,
      );
    }
  }

  private attachTrackEndListener(audioPlayer: AudioPlayer, guildId: string) {
    const playlist = this.guildService.getOrCreatePlaylist(guildId);

    audioPlayer.on('stateChange', async (oldState, newState) => {
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        const finishedTrack = playlist.queue.shift();
        console.log(`Retrait de ${finishedTrack.title}`);

        if (playlist.queue.length > 0) {
          await this.playNextTrack(guildId);
        } else {
          await this.discordService.sendMessageToChannel(
            playlist.textChannel.channelId,
            'La playlist est vide',
          );
          delete playlist.currentlyPlaying;
        }
      }
    });
  }

  async showPlaylist(message) {
    const guildId = message.guildId;
    const playlist = this.guildService.getOrCreatePlaylist(guildId);

    if (playlist.queue.length > 0) {
      message.reply(buildMessageToShowPlaylist(playlist));
    } else {
      message.reply('La playlist est actuellement vide.');
    }
  }
}
