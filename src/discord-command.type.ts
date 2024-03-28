interface DiscordCommandType {
  trigger: string;
  description: string;
}

type DiscordCommand = 'PLAY' | 'STOP' | 'DISCONNECT';

export const COMMANDS: Record<DiscordCommand, DiscordCommandType> = {
  PLAY: { trigger: '!play', description: '' },
  STOP: { trigger: '!stop', description: '' },
  DISCONNECT: { trigger: '!disconnect', description: '' },
};
