import { Test, TestingModule } from '@nestjs/testing';
import { MusicPlayerService } from './music-player.service';
import { VoiceConnectionService } from '../voice-connection/voice-connection-service.service';
import { AudioPlayerStatus } from '@discordjs/voice';
import { mockMessage } from '../../mock/message.mock';
import { YoutubeModule } from '../youtube/youtube.module';
import { MUSIC_MESSAGES } from '../../discord-messages.type';
import { GuildModule } from '../guild/guild.module';
import { GuildService } from '../guild/guild.service';

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
  let guildService: GuildService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule, GuildModule],
      providers: [MusicPlayerService, VoiceConnectionService, GuildService],
    }).compile();

    service = module.get<MusicPlayerService>(MusicPlayerService);
    voiceConnectionService = module.get<VoiceConnectionService>(
      VoiceConnectionService,
    );
    guildService = module.get<GuildService>(GuildService);
  });

  describe('play', () => {
    it('should play music and reply with the video title', async () => {
      const url = 'https://www.youtube.com/';
      const videoTitle = 'Video Title';
      const spyJoinAndPlay = jest.spyOn(voiceConnectionService, 'joinAndPlay');
      const message = mockMessage(`!play ${url}`);

      await service.play(message);

      expect(spyJoinAndPlay).toHaveBeenCalledWith(
        message,
        url,
        expect.anything(),
      );
      expect(message.reply).toHaveBeenCalledWith(
        expect.stringContaining(videoTitle),
      );
    });

    it('should reply an error message because the url given is wrong', async () => {
      const url = 'https://www.google.fr';
      const spyJoinAndPlay = jest.spyOn(voiceConnectionService, 'joinAndPlay');
      const message = mockMessage(`!play ${url}`);

      await service.play(message);

      expect(spyJoinAndPlay).not.toHaveBeenCalled();
      expect(message.reply).toHaveBeenCalledWith(
        expect.stringContaining(MUSIC_MESSAGES.MUST_GIVE_YOUTUBE_URL),
      );
    });

    it('should reply an error message because the user is not a voice channel', async () => {
      const url = 'https://www.youtube.com/';
      const spyJoinAndPlay = jest.spyOn(voiceConnectionService, 'joinAndPlay');
      const message = mockMessage(`!play ${url}`);
      message.member.voice.channel = undefined;

      await service.play(message);

      expect(spyJoinAndPlay).not.toHaveBeenCalled();
      expect(message.reply).toHaveBeenCalledWith(
        expect.stringContaining(MUSIC_MESSAGES.USER_MUST_BE_IN_VOICE_CHANNEL),
      );
    });
  });

  describe('stop', () => {
    it('should stop the music and reply with a stop message', async () => {
      const message = mockMessage('!stop');

      await service.stop(message);

      expect(message.reply).toHaveBeenCalledWith(
        expect.stringContaining(MUSIC_MESSAGES.MUSIC_STOPPED),
      );
    });
  });
});
