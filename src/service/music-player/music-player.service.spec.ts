import { Test, TestingModule } from '@nestjs/testing';
import { MusicPlayerService } from './music-player.service';
import { VoiceConnectionService } from '../voice-connection/voice-connection-service.service';
import { AudioPlayerStatus } from '@discordjs/voice';
import { mockMessage } from '../../mock/message.mock';
import { YoutubeModule } from '../youtube/youtube.module';
import { MUSIC_MESSAGES } from '../../discord-messages.type';

jest.mock('@discordjs/voice', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { discordjsVoiceMock } = require('../../mock/discordjs-voice.mock');
  return discordjsVoiceMock;
});

jest.mock('ytdl-core', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../../mock/ytdl-core.mock').default;
});

describe('MusicPlayerService', () => {
  let service: MusicPlayerService;
  let voiceConnectionService: VoiceConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule],
      providers: [MusicPlayerService, VoiceConnectionService],
    }).compile();

    service = module.get<MusicPlayerService>(MusicPlayerService);
    voiceConnectionService = module.get<VoiceConnectionService>(
      VoiceConnectionService,
    );
  });

  describe('play', () => {
    it('should play music and reply with the video title', async () => {
      const url = 'https://www.youtube.com/';
      const videoTitle = 'Video Title';
      const spyJoinAndPlay = jest.spyOn(voiceConnectionService, 'joinAndPlay');
      const message = mockMessage('!play https://www.youtube.com/');

      await service.play(message);

      expect(spyJoinAndPlay).toHaveBeenCalledWith(
        message.member.voice.channel,
        url,
        expect.anything(),
      );
      expect(message.reply).toHaveBeenCalledWith(
        expect.stringContaining(videoTitle),
      );
    });
  });

  describe('stop', () => {
    it('should stop the music and reply with a stop message', () => {
      const message = mockMessage('!stop');
      service.player.state.status = AudioPlayerStatus.Playing;

      service.stop(message);

      expect(service.player.stop).toHaveBeenCalled();
      expect(message.reply).toHaveBeenCalledWith(
        expect.stringContaining(MUSIC_MESSAGES.MUSIC_STOPPED),
      );
    });
  });
});
