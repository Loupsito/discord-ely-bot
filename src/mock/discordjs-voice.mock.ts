export const discordjsVoiceMock = {
  joinVoiceChannel: jest.fn().mockImplementation(() => {
    return {
      subscribe: jest.fn(),
    };
  }),
  createAudioPlayer: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    stop: jest.fn(),
    state: {
      status: 'idle',
    },
  })),
  createAudioResource: jest.fn(),
  AudioPlayerStatus: {
    Idle: 'idle',
  },
};
