import { Test, TestingModule } from '@nestjs/testing';
import { MusicPlayerService } from './music-player.service';

describe('MusicPlayerService', () => {
  let service: MusicPlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicPlayerService],
    }).compile();

    service = module.get<MusicPlayerService>(MusicPlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
