import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits } from 'discord.js';

jest.mock('discord.js', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      login: jest.fn(),
      on: jest.fn(),
      user: { tag: 'testUser#1234' },
    })),
    GatewayIntentBits: {
      Guilds: 0,
      GuildMessages: 0,
      MessageContent: 0,
      GuildVoiceStates: 0,
    },
  };
});

describe('DiscordService', () => {
  let service: DiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
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

    service = module.get<DiscordService>(DiscordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login with the DISCORD_TOKEN from config service', async () => {
    const loginSpy = jest.spyOn(service['client'], 'login');
    await service.onModuleInit();
    expect(loginSpy).toHaveBeenCalledWith('test-token');
  });

  it('should correctly initialize client with intents', () => {
    const clientInstance = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    expect(Client).toHaveBeenCalledWith({
      intents: [
        expect.any(Number), // Use specific GatewayIntentBits values if needed
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ],
    });
    expect(clientInstance.login).not.toHaveBeenCalled(); // Ensure login is not called upon initialization
  });
});
