import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DiscordService } from './service/discord/discord.service';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { VoiceConnectionService } from './service/voice-connection/voice-connection-service.service';
import { HelpService } from './service/help/help.service';
import { COMMANDS } from './discord-command.type';
import { ConfigService } from '@nestjs/config';
import { YoutubeService } from './service/youtube/youtube-service.service';

jest.mock('@discordjs/voice', () => {
  return {
    joinVoiceChannel: jest.fn(),
    createAudioPlayer: jest.fn().mockImplementation(() => ({
      play: jest.fn(),
    })),
    createAudioResource: jest.fn(),
  };
});

describe('AppService', () => {
  let appService: AppService;
  let discordService: DiscordService;
  let musicPlayerService: MusicPlayerService;
  let voiceConnectionService: VoiceConnectionService;
  let helpService: HelpService;
  let youtubeService: YoutubeService;

  beforeEach(async () => {
    const discordClientMock = {
      on: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DiscordService,
          useValue: {
            discordClient: discordClientMock, // Utilisation du mock ici
          },
        },
        MusicPlayerService,
        VoiceConnectionService,
        HelpService,
        YoutubeService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'DISCORD_TOKEN') {
                return 'test-token';
              }
            }),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    discordService = module.get<DiscordService>(DiscordService);
    musicPlayerService = module.get<MusicPlayerService>(MusicPlayerService);
    voiceConnectionService = module.get<VoiceConnectionService>(
      VoiceConnectionService,
    );
    helpService = module.get<HelpService>(HelpService);
    youtubeService = module.get<YoutubeService>(YoutubeService);
  });

  it('should attach messageCreate event listener on module init', async () => {
    const onSpy = jest.spyOn(discordService.discordClient, 'on');
    await appService.onModuleInit();
    expect(onSpy).toHaveBeenCalledWith('messageCreate', expect.any(Function));
  });

  describe('handleMessageCreate', () => {
    const mockMessage = (content: string) => ({
      content,
      author: {
        globalName: 'ely',
      },
      guild: {
        name: 'Elysium',
      },
      member: {
        voice: {
          channel: {
            id: 'channelId',
            guild: {
              id: 'guildId',
              voiceAdapterCreator: jest.fn(),
            },
          },
        },
      },
    });

    it('should call play on MUSIC command', async () => {
      const message = mockMessage(
        `${COMMANDS.PLAY.trigger} https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      );
      await appService.handleMessageCreate(message);
      expect(musicPlayerService.play).toHaveBeenCalledWith(message);
    });

    it('should call stop on STOP command', async () => {
      const message = mockMessage(COMMANDS.STOP.trigger);
      await appService.handleMessageCreate(message);
      expect(musicPlayerService.stop).toHaveBeenCalledWith(message);
    });

    it('should call disconnect on DISCONNECT command', async () => {
      const message = mockMessage(COMMANDS.DISCONNECT.trigger);
      await appService.handleMessageCreate(message);
      expect(voiceConnectionService.disconnect).toHaveBeenCalledWith(message);
    });

    it('should call listAllCommands on HELP command', async () => {
      const message = mockMessage(COMMANDS.HELP.trigger);
      await appService.handleMessageCreate(message);
      expect(helpService.listAllCommands).toHaveBeenCalledWith(message);
    });

    it('should not call any service on unknown command', async () => {
      const message = mockMessage('unknown');
      await appService.handleMessageCreate(message);
      expect(musicPlayerService.play).not.toHaveBeenCalled();
      expect(musicPlayerService.stop).not.toHaveBeenCalled();
      expect(voiceConnectionService.disconnect).not.toHaveBeenCalled();
      expect(helpService.listAllCommands).not.toHaveBeenCalled();
    });
  });
});
