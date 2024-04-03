export const mockMessage = (content: string) => ({
  guildId: 'guildId123',
  content,
  author: {
    globalName: 'ely',
  },
  guild: {
    name: 'Elysium',
  },
  member: {
    voice: {
      channel: {
        id: 'channelId',
        guild: {
          id: 'guildId',
          voiceAdapterCreator: jest.fn(),
        },
      },
    },
  },
  reply: jest.fn(),
});
