import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AudioPlayerStatus } from '@discordjs/voice';
import { YoutubeService } from '../youtube/youtube-service.service';
import { VoiceConnectionService } from '../voice-connection/voice-connection-service.service';
import { MUSIC_MESSAGES } from '../../discord-messages.type';
import { GuildService } from '../guild/guild.service';
import {
  isYoutubeUrl,
  replyErrorMessageIfNotInVoiceChannel,
} from '../../util/music-command.utils';
import { DiscordService } from '../discord/discord.service';
import { PlaylistService } from '../playlist/playlist.service';

@Injectable()
export class AudioPlayerService {
  constructor(
    private voiceConnectionService: VoiceConnectionService,
    private youtubeService: YoutubeService,
    private guildService: GuildService,
    private discordService: DiscordService,
    @Inject(forwardRef(() => PlaylistService))
    private playlistService: PlaylistService,
  ) {}

  async play(message, urlGiven?: string, fromPlaylist: boolean = false) {
    try {
      await replyErrorMessageIfNotInVoiceChannel(message);
      const url = urlGiven
        ? urlGiven
        : await this.extractUrlFromMessageContent(message);

      if (!fromPlaylist) {
        await this.playlistService.pauseCurrentPlaylistIfNeeded(message);
      }

      const audioPlayer = this.guildService.getOrCreateAudioPlayer(
        message.guildId,
      );
      this.voiceConnectionService.joinAndPlay(message, url, audioPlayer);

      const videoTitle = await this.youtubeService.getVideoTitle(url);
      return this.discordService.sendMessageToChannel(
        message.channelId,
        `**${MUSIC_MESSAGES.CURRENTLY_PLAYING} :** ${videoTitle}`,
      );
    } catch (error) {
      message.reply(error);
    }
  }

  async stop(message: any) {
    try {
      await replyErrorMessageIfNotInVoiceChannel(message);

      const audioPlayer = this.guildService.getOrCreateAudioPlayer(
        message.guildId,
      );
      const playlist = this.guildService.getOrCreatePlaylist(message.guildId);

      let replyMessage = '';

      if (audioPlayer.state.status !== AudioPlayerStatus.Idle) {
        audioPlayer.stop();
        replyMessage += MUSIC_MESSAGES.MUSIC_STOPPED;
      } else {
        return message.reply(
          `Aucune musique ou playlist n'est en cours de lecture`,
        );
      }

      if (playlist.queue.length > 0) {
        playlist.queue = [];
        replyMessage += ' et la playlist vidée';
      }

      return message.reply(replyMessage);
    } catch (error) {
      message.reply(error);
    }
  }

  async pause(message) {
    await replyErrorMessageIfNotInVoiceChannel(message);
    const guildId = message.guildId;
    const audioPlayer = this.guildService.getOrCreateAudioPlayer(guildId);

    if (audioPlayer.state.status === AudioPlayerStatus.Playing) {
      audioPlayer.pause();
      message.reply('La musique a été mise en pause.');
    } else {
      message.reply(
        "Aucune musique n'est actuellement en lecture pour être mise en pause",
      );
    }
  }

  async resume(message) {
    await replyErrorMessageIfNotInVoiceChannel(message);
    const guildId = message.guildId;
    const audioPlayer = this.guildService.getOrCreateAudioPlayer(guildId);

    if (audioPlayer.state.status === AudioPlayerStatus.Paused) {
      audioPlayer.unpause();
      message.reply('La lecture de la musique reprend');
    } else {
      message.reply("La musique n'est pas en pause actuellement");
    }
  }

  private extractUrlFromMessageContent(message): Promise<string> {
    return new Promise((resolve, reject) => {
      const commands = message.content.split(' ');

      if (commands.length < 2 || !isYoutubeUrl(commands[1])) {
        reject(MUSIC_MESSAGES.MUST_GIVE_YOUTUBE_URL);
      }

      resolve(commands[1]);
    });
  }
}
