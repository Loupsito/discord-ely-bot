import { Injectable } from '@nestjs/common';
import { AudioPlayerStatus } from '@discordjs/voice';
import { YoutubeService } from '../youtube/youtube-service.service';
import { VoiceConnectionService } from '../voice-connection/voice-connection-service.service';
import { MUSIC_MESSAGES } from '../../discord-messages.type';
import { GuildService } from '../guild/guild.service';
import { isYoutubeUrl } from '../../util/music-command.utils';
import { Message } from 'discord.js';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class MusicPlayerService {
  constructor(
    private voiceConnectionService: VoiceConnectionService,
    private youtubeService: YoutubeService,
    private guildService: GuildService,
    private discordService: DiscordService,
  ) {}

  async play(message: Message, urlGiven?: string) {
    try {
      await this.replyErrorMessageIfNotInVoiceChannel(message);
      const url = urlGiven
        ? urlGiven
        : await this.extractUrlFromMessageContent(message);

      const musicPlayer = this.guildService.getOrCreateAudioPlayer(
        message.guildId,
      );
      this.voiceConnectionService.joinAndPlay(message, url, musicPlayer);

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
      await this.replyErrorMessageIfNotInVoiceChannel(message);

      const musicPlayer = this.guildService.getOrCreateAudioPlayer(
        message.guildId,
      );
      if (musicPlayer.state.status !== AudioPlayerStatus.Idle) {
        musicPlayer.stop();
      }

      return message.reply(MUSIC_MESSAGES.MUSIC_STOPPED);
    } catch (error) {
      message.reply(error);
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

  private replyErrorMessageIfNotInVoiceChannel(message) {
    return new Promise<void>((resolve, reject) => {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        reject(MUSIC_MESSAGES.USER_MUST_BE_IN_VOICE_CHANNEL);
      }
      resolve();
    });
  }
}
