import { ConfigService } from '@nestjs/config';

export const configServiceMock = {
  provide: ConfigService,
  useValue: {
    get: jest.fn((key) => {
      if (key === 'DISCORD_TOKEN') {
        return 'test-token';
      }
    }),
  },
};
