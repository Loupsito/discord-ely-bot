import { Test, TestingModule } from '@nestjs/testing';
import { DiscordHandleCommandsService } from './discord-handle-commands.service';

describe('DiscordHandleCommandsService', () => {
  let service: DiscordHandleCommandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordHandleCommandsService],
    }).compile();

    service = module.get<DiscordHandleCommandsService>(DiscordHandleCommandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
