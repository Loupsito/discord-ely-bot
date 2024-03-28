interface DiscordCommandType {
  triggerCommand: string;
  description: string;
}

type DiscordCommand = 'PLAY' | 'STOP' | 'DISCONNECT';

export const COMMANDS: Record<DiscordCommand, DiscordCommandType> = {
  PLAY: { triggerCommand: '!play', description: '' },
  STOP: { triggerCommand: '!stop', description: '' },
  DISCONNECT: { triggerCommand: '!disconnect', description: '' },
};
