import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { GuildService } from '../guild/guild.service';
import { AudioPlayerService } from '../audio-player/audio-player.service';
import {
  buildMessageToShowPlaylist,
  extractUrlFromMessageContent,
  replyErrorMessageIfNotInVoiceChannel,
} from '../../util/music-command.utils';
import { YoutubeService } from '../youtube/youtube-service.service';
import { DiscordService } from '../discord/discord.service';
import { COMMANDS_PLAYLIST } from '../../type/discord-command.type';

@Injectable()
export class PlaylistService {
  constructor(
    private guildService: GuildService,
    @Inject(forwardRef(() => AudioPlayerService))
    private audioPlayerService: AudioPlayerService,
    private youtubeService: YoutubeService,
    private discordService: DiscordService,
  ) {}

  public async addTrackToPlaylist(message) {
    await replyErrorMessageIfNotInVoiceChannel(message);

    const audioPlayer = this.guildService.getOrCreateAudioPlayer(
      message.guildId,
    );
    const urlTrack = await extractUrlFromMessageContent(message);
    const playlist = this.guildService.getOrCreatePlaylist(message.guildId);
    const audioInfos = await this.youtubeService.getVideoTitle(urlTrack);

    playlist.queue.push({
      url: urlTrack,
      title: audioInfos.title,
      duration: audioInfos.duration,
    });

    if (!playlist.textChannel) {
      playlist.textChannel = message;
    }

    playlist.isMarkedAsEmpty = false;

    if (audioPlayer.state.status !== AudioPlayerStatus.Playing) {
      message.reply(
        `Ajout à la playlist de **${audioInfos.title}** - [${audioInfos.duration}] et lancement de la lecture`,
      );
      await this.playNextTrack(message.guildId);
    } else {
      message.reply(
        `Ajout à la playlist de **${audioInfos.title} - [${audioInfos.duration}]**`,
      );
    }
  }

  async playNextTrack(guildId: string) {
    const playlist = this.guildService.getOrCreatePlaylist(guildId);
    const queue = playlist.queue;
    const audioPlayer = this.guildService.getOrCreateAudioPlayer(guildId);

    if (playlist && queue.length > 0 && !playlist.isPaused) {
      const currentTrack = queue[0];
      playlist.currentlyPlaying = currentTrack;
      this.attachTrackEndListener(audioPlayer, guildId);

      await this.audioPlayerService.play(
        playlist.textChannel,
        currentTrack.url,
        true,
      );
    }
  }

  public async moveToNextTrack(message) {
    await this.replyErrorMessageIfPlaylistIsNotCurrentlyPlaying(message);
    await replyErrorMessageIfNotInVoiceChannel(message);

    const playlist = this.guildService.getOrCreatePlaylist(message.guildId);
    playlist.queue.shift();

    message.reply(`Passage à la musique suivante.`);
    await this.playNextTrack(message.guildId);
  }

  async showPlaylist(message) {
    const guildId = message.guildId;
    const playlist = this.guildService.getOrCreatePlaylist(guildId);

    if (playlist.queue.length > 0) {
      message.reply(buildMessageToShowPlaylist(playlist));
    } else {
      let replyMessage = `La playlist est actuellement vide. `;
      if (playlist.currentlyPlaying) {
        replyMessage += `Mais il reste encore une musique en cours de lecture : \n\n${playlist.currentlyPlaying.title}\n**[▶️ En cours de lecture]**`;
      }
      message.reply(replyMessage);
    }
  }

  public async emptyPlaylist(message) {
    await replyErrorMessageIfNotInVoiceChannel(message);

    const guildId = message.guildId;
    const playlist = this.guildService.getOrCreatePlaylist(guildId);

    if (playlist.queue.length > 0) {
      playlist.queue = [];

      message.reply('La playlist a été vidée.');
    } else {
      message.reply('La playlist est déjà vide.');
    }
  }

  async pauseCurrentPlaylistIfNeeded(message) {
    const playlist = this.guildService.getOrCreatePlaylist(message.guildId);
    if (playlist.queue.length > 0 || playlist.currentlyPlaying) {
      playlist.isPaused = true;
      await this.discordService.sendMessageToChannel(
        playlist.textChannel.channelId,
        `La playlist a été mis en pause.\nVous pourrez reprendre sa lecture avec la commande **${COMMANDS_PLAYLIST.RESUMEPLAYLIST.trigger}**`,
      );
    }
  }

  public async resumePlaylist(message) {
    const guildId = message.guildId;
    const playlist = this.guildService.getOrCreatePlaylist(guildId);
    if (playlist.isPaused && playlist.queue.length > 0) {
      playlist.isPaused = false;
      await this.playNextTrack(guildId);
      message.reply('La playlist reprend.');
    } else {
      message.reply('Aucune playlist à reprendre.');
    }
  }

  private replyErrorMessageIfPlaylistIsNotCurrentlyPlaying(message) {
    return new Promise<void>((resolve, reject) => {
      const playlist = this.guildService.getOrCreatePlaylist(message.guildId);
      if (playlist.isPaused) {
        reject(
          `La playlist est actuellement en pause. Veuillez relancer la playlist en exécutant la commande **${COMMANDS_PLAYLIST.RESUMEPLAYLIST.trigger}**`,
        );
      }
      resolve();
    });
  }

  private attachTrackEndListener(audioPlayer: AudioPlayer, guildId: string) {
    const playlist = this.guildService.getOrCreatePlaylist(guildId);
    const listener = async (oldState, newState) => {
      playlist.isListenerAttached = true;
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        if (playlist.queue.length > 0) {
          playlist.queue.shift();
          await this.playNextTrack(guildId);
        } else if (!playlist.isMarkedAsEmpty) {
          playlist.isMarkedAsEmpty = true;
          await this.discordService.sendMessageToChannel(
            playlist.textChannel.channelId,
            'La playlist est vide',
          );
          delete playlist.currentlyPlaying;
        }
      }
    };
    if (!playlist.isListenerAttached) {
      console.log('=======> ListenerAttached');
      audioPlayer.on('stateChange', listener);
    }
  }
}
