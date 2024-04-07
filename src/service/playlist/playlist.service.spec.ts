import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistService } from './playlist.service';
import { GuildService } from '../guild/guild.service';
import { AudioPlayerService } from '../audio-player/audio-player.service';
import { YoutubeService } from '../youtube/youtube-service.service';
import { DiscordService } from '../discord/discord.service';
import { YoutubeModule } from '../youtube/youtube.module';
import { GuildModule } from '../guild/guild.module';

describe('PlaylistService', () => {
  let service: PlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule, GuildModule],
      providers: [
        PlaylistService,
        GuildService,
        AudioPlayerService,
        YoutubeService,
        DiscordService,
      ],
    }).compile();

    service = module.get<PlaylistService>(PlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
