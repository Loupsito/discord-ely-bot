import { Injectable, Logger } from '@nestjs/common';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { DiscordService } from './service/discord/discord.service';
import { VoiceConnectionService } from './service/voice-connection/voice-connection-service.service';
import {
  COMMANDS_AUDIO_PLAYER,
  COMMANDS_OTHER,
  COMMANDS_PLAYLIST,
} from './discord-command.type';
import { logCommand } from './infrastructure/discord-commands.interceptor';
import { HelpService } from './service/help/help.service';
import { PlaylistService } from './service/playlist/playlist.service';

@Injectable()
export class AppService {
  private logger = new Logger('AppService');
  constructor(
    private readonly discordService: DiscordService,
    private readonly musicPlayerService: MusicPlayerService,
    private readonly playlistService: PlaylistService,
    private readonly voiceConnectionService: VoiceConnectionService,
    private readonly helpService: HelpService,
  ) {}

  async onModuleInit() {
    this.discordService.discordClient.on(
      'messageCreate',
      this.handleMessageCreate.bind(this),
    );
  }

  async handleMessageCreate(message) {
    const commandActions = {
      [COMMANDS_AUDIO_PLAYER.PLAY.trigger]: () =>
        this.musicPlayerService.play(message),
      [COMMANDS_AUDIO_PLAYER.STOP.trigger]: () =>
        this.musicPlayerService.stop(message),
      [COMMANDS_AUDIO_PLAYER.PAUSE.trigger]: () =>
        this.musicPlayerService.pause(message),
      [COMMANDS_AUDIO_PLAYER.RESUME.trigger]: () =>
        this.musicPlayerService.resume(message),

      [COMMANDS_PLAYLIST.ADD.trigger]: () =>
        this.playlistService.addTrackToPlaylist(message),
      [COMMANDS_PLAYLIST.PLAYLIST.trigger]: () =>
        this.playlistService.showPlaylist(message),
      [COMMANDS_PLAYLIST.EMPTY.trigger]: () =>
        this.playlistService.emptyPlaylist(message),
      [COMMANDS_PLAYLIST.NEXT.trigger]: () =>
        this.playlistService.moveToNextTrack(message),
      [COMMANDS_PLAYLIST.RESUMEPLAYLIST.trigger]: () =>
        this.playlistService.resumePlaylist(message),

      [COMMANDS_OTHER.DISCONNECT.trigger]: () =>
        this.voiceConnectionService.disconnect(message),
      [COMMANDS_OTHER.HELP.trigger]: () =>
        this.helpService.listAllCommands(message),
    };

    const command = message.content.split(' ')[0];
    const action = commandActions[command];

    try {
      if (action) {
        logCommand(command, message);
        await action();
      }
    } catch (e) {
      this.logger.error(`Error when running command ${command}`, e);
      message.reply(e);
    }
  }
}
