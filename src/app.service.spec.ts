import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DiscordService } from './service/discord/discord.service';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { VoiceConnectionService } from './service/voice-connection/voice-connection-service.service';
import { HelpService } from './service/help/help.service';
import { COMMANDS } from './discord-command.type';
import { YoutubeService } from './service/youtube/youtube-service.service';
import { YoutubeModule } from './service/youtube/youtube.module';
import { discordjsVoiceMock } from './mock/discordjs-voice.mock';
import { discordServiceMock } from './mock/discord-service.mock';
import { configServiceMock } from './mock/config-service.mock';
import { mockMessage } from './mock/message.mock';

jest.mock('@discordjs/voice', () => discordjsVoiceMock);

describe('AppService', () => {
  let appService: AppService;
  let discordService: DiscordService;
  let musicPlayerService: MusicPlayerService;
  let voiceConnectionService: VoiceConnectionService;
  let helpService: HelpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule],
      providers: [
        AppService,
        discordServiceMock,
        MusicPlayerService,
        VoiceConnectionService,
        HelpService,
        YoutubeService,
        configServiceMock,
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    discordService = module.get<DiscordService>(DiscordService);
    musicPlayerService = module.get<MusicPlayerService>(MusicPlayerService);
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
    it('should call play on MUSIC command', async () => {
      const message = mockMessage(
        `${COMMANDS.PLAY.trigger} https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      );
      const spyPlay = jest.spyOn(musicPlayerService, 'play');
      await appService.handleMessageCreate(message);
      expect(spyPlay).toHaveBeenCalledWith(message);
    });

    it('should call stop on STOP command', async () => {
      const message = mockMessage(COMMANDS.STOP.trigger);
      const spyStop = jest.spyOn(musicPlayerService, 'stop');
      await appService.handleMessageCreate(message);
      expect(spyStop).toHaveBeenCalledWith(message);
    });

    it('should call disconnect on DISCONNECT command', async () => {
      const message = mockMessage(COMMANDS.DISCONNECT.trigger);
      const spyDisconnect = jest.spyOn(voiceConnectionService, 'disconnect');
      await appService.handleMessageCreate(message);
      expect(spyDisconnect).toHaveBeenCalledWith(message);
    });

    it('should call listAllCommands on HELP command', async () => {
      const message = mockMessage(COMMANDS.HELP.trigger);
      const spyListCommands = jest.spyOn(helpService, 'listAllCommands');
      await appService.handleMessageCreate(message);
      expect(spyListCommands).toHaveBeenCalledWith(message);
    });

    it('should not call any service on unknown command', async () => {
      const spyPlay = jest.spyOn(musicPlayerService, 'play');
      const spyStop = jest.spyOn(musicPlayerService, 'stop');
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
