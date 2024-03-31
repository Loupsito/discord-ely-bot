import { Test, TestingModule } from '@nestjs/testing';
import { HelpService } from './help.service';
import { COMMANDS } from '../../discord-command.type';

describe('HelpService', () => {
  let service: HelpService;
  let mockMessage: { reply: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpService],
    }).compile();

    service = module.get<HelpService>(HelpService);
    mockMessage = { reply: jest.fn() };
  });

  it('should list all commands correctly with their descriptions and examples', () => {
    service.listAllCommands(mockMessage);
    expect(mockMessage.reply).toHaveBeenCalled();
    const replyCallArgument = mockMessage.reply.mock.calls[0][0];

    expect(replyCallArgument).toContain('Voici les commandes disponibles :');

    Object.values(COMMANDS).forEach((command) => {
      expect(replyCallArgument).toContain(command.trigger);
      expect(replyCallArgument).toContain(command.description);
      expect(replyCallArgument).toContain(command.example);
    });
  });

  it('should format the help message correctly for each command', () => {
    service.listAllCommands(mockMessage);
    const replyCallArgument = mockMessage.reply.mock.calls[0][0];

    Object.values(COMMANDS).forEach((command) => {
      const expectedFormat = `**➡️ ${command.trigger}: ${command.description}**\nExemple : ${command.example}`;
      expect(replyCallArgument).toContain(expectedFormat);
    });
  });
});
