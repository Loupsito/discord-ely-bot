const mockYtdlFunction = jest.fn().mockImplementation(() => ({
  pipe: jest.fn(),
}));

const ytdlMock = Object.assign(mockYtdlFunction, {
  getInfo: jest.fn().mockResolvedValue({
    videoDetails: { title: 'Test Video Title' },
  }),
});

export default ytdlMock;
