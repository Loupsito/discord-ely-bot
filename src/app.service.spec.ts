import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DiscordService } from './service/discord/discord.service';
import { AudioPlayerService } from './service/audio-player/audio-player.service';
import { VoiceConnectionService } from './service/voice-connection/voice-connection-service.service';
import { HelpService } from './service/help/help.service';
import { COMMANDS_AUDIO_PLAYER, COMMANDS_OTHER } from './type/discord-command.type';
import { YoutubeService } from './service/youtube/youtube-service.service';
import { YoutubeModule } from './service/youtube/youtube.module';
import { discordServiceMock } from './mock/discord-service.mock';
import { configServiceMock } from './mock/config-service.mock';
import { mockMessage } from './mock/message.mock';
import { GuildModule } from './service/guild/guild.module';
import { GuildService } from './service/guild/guild.service';
import { PlaylistService } from './service/playlist/playlist.service';

jest.mock('@discordjs/voice', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { discordjsVoiceMock } = require('./mock/discordjs-voice.mock');
  return discordjsVoiceMock;
});

describe('AppService', () => {
  let appService: AppService;
  let discordService: DiscordService;
  let audioPlayerService: AudioPlayerService;
  let voiceConnectionService: VoiceConnectionService;
  let helpService: HelpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule, GuildModule],
      providers: [
        AppService,
        discordServiceMock,
        AudioPlayerService,
        VoiceConnectionService,
        HelpService,
        YoutubeService,
        configServiceMock,
        GuildService,
        PlaylistService,
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    discordService = module.get<DiscordService>(DiscordService);
    audioPlayerService = module.get<AudioPlayerService>(AudioPlayerService);
    voiceConnectionService = module.get<VoiceConnectionService>(
      VoiceConnectionService,
    );
    helpService = module.get<HelpService>(HelpService);
  });

  it('should attach messageCreate event listener on module init', async () => {
    const onSpy = jest.spyOn(discordService.discordClient, 'on');
    await appService.onModuleInit();
    expect(onSpy).toHaveBeenCalledWith('messageCreate', expect.any(Function));
  });

  describe('handleMessageCreate', () => {
    it('should call play on PLAY command', async () => {
      const message = mockMessage(
        `${COMMANDS_AUDIO_PLAYER.PLAY.trigger} https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      );
      const spyPlay = jest.spyOn(audioPlayerService, 'play');
      await appService.handleMessageCreate(message);
      expect(spyPlay).toHaveBeenCalledWith(message);
    });

    it('should call stop on STOP command', async () => {
      const message = mockMessage(COMMANDS_AUDIO_PLAYER.STOP.trigger);
      const spyStop = jest.spyOn(audioPlayerService, 'stop');
      await appService.handleMessageCreate(message);
      expect(spyStop).toHaveBeenCalledWith(message);
    });

    it('should call disconnect on DISCONNECT command', async () => {
      const message = mockMessage(COMMANDS_OTHER.DISCONNECT.trigger);
      const spyDisconnect = jest.spyOn(voiceConnectionService, 'disconnect');
      await appService.handleMessageCreate(message);
      expect(spyDisconnect).toHaveBeenCalledWith(message);
    });

    it('should call listAllCommands on HELP command', async () => {
      const message = mockMessage(COMMANDS_OTHER.HELP.trigger);
      const spyListCommands = jest.spyOn(helpService, 'listAllCommands');
      await appService.handleMessageCreate(message);
      expect(spyListCommands).toHaveBeenCalledWith(message);
    });

    it('should not call any service on unknown command', async () => {
      const spyPlay = jest.spyOn(audioPlayerService, 'play');
      const spyStop = jest.spyOn(audioPlayerService, 'stop');
      const spyDisconnect = jest.spyOn(voiceConnectionService, 'disconnect');
      const spyListCommands = jest.spyOn(helpService, 'listAllCommands');

      const message = mockMessage('unknown');
      await appService.handleMessageCreate(message);
      expect(spyPlay).not.toHaveBeenCalled();
      expect(spyStop).not.toHaveBeenCalled();
      expect(spyDisconnect).not.toHaveBeenCalled();
      expect(spyListCommands).not.toHaveBeenCalled();
    });
  });
});
