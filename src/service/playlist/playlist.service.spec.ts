import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistService } from './playlist.service';
import { GuildService } from '../guild/guild.service';
import { AudioPlayerService } from '../audio-player/audio-player.service';
import { YoutubeModule } from '../youtube/youtube.module';
import { GuildModule } from '../guild/guild.module';
import { DiscordModule } from '../discord/discord.module';
import { VoiceConnectionService } from '../voice-connection/voice-connection-service.service';
import { ConfigService } from '@nestjs/config';

describe('PlaylistService', () => {
  let service: PlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule, GuildModule, DiscordModule],
      providers: [
        AudioPlayerService,
        GuildService,
        PlaylistService,
        VoiceConnectionService,
        ConfigService,
      ],
    }).compile();

    service = module.get<PlaylistService>(PlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
