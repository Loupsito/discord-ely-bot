import { Test, TestingModule } from '@nestjs/testing';
import { DiscordConfigService } from './discord-config.service';

describe('DiscordService', () => {
  let service: DiscordConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordConfigService],
    }).compile();

    service = module.get<DiscordConfigService>(DiscordConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
