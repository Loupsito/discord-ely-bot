import { Injectable, Logger } from '@nestjs/common';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { DiscordService } from './service/discord/discord.service';
import { VoiceConnectionService } from './service/voice-connection/voice-connection-service.service';
import { COMMANDS } from './discord-command.type';
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
      [COMMANDS.PLAY.trigger]: () => this.musicPlayerService.play(message),
      [COMMANDS.STOP.trigger]: () => this.musicPlayerService.stop(message),
      [COMMANDS.PAUSE.trigger]: () => this.musicPlayerService.pause(message),
      [COMMANDS.RESUME.trigger]: () => this.musicPlayerService.resume(message),
      [COMMANDS.ADD.trigger]: () =>
        this.playlistService.addTrackToPlaylist(message),
      [COMMANDS.PLAYLIST.trigger]: () =>
        this.playlistService.showPlaylist(message),
      [COMMANDS.EMPTY.trigger]: () =>
        this.playlistService.emptyPlaylist(message),
      [COMMANDS.NEXT.trigger]: () =>
        this.playlistService.moveToNextTrack(message),
      [COMMANDS.RESUMEPLAYLIST.trigger]: () =>
        this.playlistService.resumePlaylist(message),
      [COMMANDS.DISCONNECT.trigger]: () =>
        this.voiceConnectionService.disconnect(message),
      [COMMANDS.HELP.trigger]: () => this.helpService.listAllCommands(message),
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
