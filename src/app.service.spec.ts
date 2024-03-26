import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { MusicPlayerService } from './service/music-player/music-player.service';
import { VoiceConnectionService } from './service/voice-connection-service/voice-connection-service.service';
import { YoutubeService } from './service/youtube-service/youtube-service.service';

describe('AppService', () => {
  let appService: AppService;
  let musicPlayerService: MusicPlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        MusicPlayerService,
        VoiceConnectionService,
        YoutubeService,
      ],
    }).compile();
    appService = module.get<AppService>(AppService);
    musicPlayerService = module.get<MusicPlayerService>(MusicPlayerService);
  });

  it('should handle !play message', async () => {
    const mockMessage = {
      guild: true,
      content: '!play http://test.url',
      reply: jest.fn(),
    };
    jest
      .spyOn(musicPlayerService, 'play')
      .mockImplementation(() => Promise.resolve());
    await appService.handleMessageCreate(mockMessage);
    expect(musicPlayerService.play).toHaveBeenCalledWith(mockMessage);
  });

  it('should handle !stop message', async () => {
    const mockMessage = {
      guild: true,
      content: '!stop',
      reply: jest.fn(),
    };
    jest
      .spyOn(musicPlayerService, 'stop')
      .mockImplementation(() => Promise.resolve());
    await appService.handleMessageCreate(mockMessage);
    expect(musicPlayerService.stop).toHaveBeenCalledWith(mockMessage);
  });

  it('should ignore non-guild messages', async () => {
    const mockMessage = {
      guild: false,
      content: '!play http://test.url',
    };
    jest.spyOn(musicPlayerService, 'play');
    await appService.handleMessageCreate(mockMessage);
    expect(musicPlayerService.play).not.toHaveBeenCalled();
  });
});
