import { Injectable, Logger } from '@nestjs/common';
import {
  AudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { YoutubeService } from '../youtube/youtube-service.service';
import {
  GENERIC_MESSAGES,
  VOICE_CHANNEL_MESSAGES,
} from '../../type/discord-messages.type';
import { GuildService } from '../guild/guild.service';
import { DiscordService } from '../discord/discord.service';
import { toMinutesAndSeconds } from '../../util/time.utils';

@Injectable()
export class VoiceConnectionService {
  private logger = new Logger('VoiceConnectionService');
  private disconnectTimeouts = new Map();
  private TIMEOUT_DURATION = 60 * 1000 * 2;

  constructor(
    private youtubeService: YoutubeService,
    private guildService: GuildService,
    private discordService: DiscordService,
  ) {}

  joinAndPlay(message: any, url: string, player: AudioPlayer) {
    const voiceConnection =
      this.guildService.getOrCreateVoiceConnection(message);
    const stream = this.youtubeService.getStream(url);
    const resource = createAudioResource(stream);
    player.play(resource);
    voiceConnection.subscribe(player);
  }

  disconnect(message) {
    const voiceConnection =
      this.guildService.getOrCreateVoiceConnection(message);

    if (
      voiceConnection &&
      voiceConnection.state.status !== VoiceConnectionStatus.Disconnected
    ) {
      voiceConnection.destroy();
      this.guildService.purgeAll(message.guildId);
      message.reply(GENERIC_MESSAGES.BYE);
    } else {
      return message.reply(VOICE_CHANNEL_MESSAGES.BOT_MUST_BE_IN_VOICE_CHANNEL);
    }
  }

  async onModuleInit() {
    this.discordService.discordClient.on(
      'voiceStateUpdate',
      (oldState, newState) => {
        // Vérifie si un membre quitte un canal vocal
        if (oldState.channelId && !newState.channelId) {
          this.checkChannelEmpty(oldState.channel);
        }
        // Vérifie si un membre rejoint un canal vocal et annule la déconnexion si nécessaire
        else if (!oldState.channelId && newState.channelId) {
          this.cancelDisconnectIfScheduled(newState.channel);
        }
      },
    );
  }

  private async checkChannelEmpty(channel) {
    if (
      channel.members.size === 1 &&
      channel.members.has(this.discordService.discordClient.user.id)
    ) {
      const channelIdToSendMessage =
        this.guildService.getChannelIdWhereBotInvoked(channel.guild.id);
      const warningMessage = `⚠️Le bot se déconnectera automatiquement dans ${toMinutesAndSeconds(this.TIMEOUT_DURATION / 1000)}. Raison : plus aucun membre dans le canal vocal.\nCette auto déconnexion s'annulera si au moins un membre se reconnecte`;

      this.logger.log(warningMessage);
      await this.discordService.sendMessageToChannel(
        channelIdToSendMessage,
        warningMessage,
      );

      const timeout = setTimeout(async () => {
        if (
          channel.members.size === 1 &&
          channel.members.has(this.discordService.discordClient.user.id)
        ) {
          const voiceConnection = this.guildService.getVoiceConnection(
            channel.guild.id,
          );

          if (voiceConnection) {
            this.guildService.purgeAll(channel.guild.id);
            voiceConnection.disconnect();

            const autoDisconnectMessage: string = `🔌 Le robot s'est déconnecté automatiquement car il n'y avait aucun membre dans le canal vocal.`;
            this.logger.log(autoDisconnectMessage);
            await this.discordService.sendMessageToChannel(
              channelIdToSendMessage,
              autoDisconnectMessage,
            );
          }
          this.disconnectTimeouts.delete(channel.id);
        }
      }, this.TIMEOUT_DURATION);
      this.disconnectTimeouts.set(channel.id, timeout);
    }
  }

  private cancelDisconnectIfScheduled(channel) {
    if (this.disconnectTimeouts.has(channel.id)) {
      clearTimeout(this.disconnectTimeouts.get(channel.id));
      this.disconnectTimeouts.delete(channel.id);
    }
  }
}
