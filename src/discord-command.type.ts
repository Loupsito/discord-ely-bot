interface DiscordCommandType {
  trigger: string;
  description: string;
  example: string;
}

type DiscordCommand = 'PLAY' | 'STOP' | 'DISCONNECT' | 'HELP';

export const COMMANDS: Record<DiscordCommand, DiscordCommandType> = {
  PLAY: {
    trigger: '!play',
    description: 'Commande qui permet de jouer une musique venant de Youtube.',
    example: '!play <youtube-url>',
  },
  STOP: {
    trigger: '!stop',
    description:
      'Commande qui permet de stopper une musique en cours de lecture.',
    example: '!stop',
  },
  DISCONNECT: {
    trigger: '!disconnect',
    description:
      'Commande qui permet de déconnecter le bot se trouvant dans un channel vocal.',
    example: '!disconnect',
  },
  HELP: {
    trigger: '!manual',
    description: `Commande qui permet d'afficher toutes les commandes disponibles du bot.`,
    example: '!manual',
  },
};
