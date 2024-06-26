import { DiscordService } from '../service/discord/discord.service';

export const discordServiceMock = {
  provide: DiscordService,
  useValue: {
    discordClient: {
      on: jest.fn(),
      channels: {
        fetch: jest.fn(),
      },
    },
    sendMessageToChannel: jest.fn(),
  },
};
