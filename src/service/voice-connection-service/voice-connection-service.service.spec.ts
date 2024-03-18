import { Test, TestingModule } from '@nestjs/testing';
import { VoiceConnectionServiceService } from './voice-connection-service.service';

describe('VoiceConnectionServiceService', () => {
  let service: VoiceConnectionServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceConnectionServiceService],
    }).compile();

    service = module.get<VoiceConnectionServiceService>(VoiceConnectionServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
