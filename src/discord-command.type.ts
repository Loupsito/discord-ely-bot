interface DiscordCommandType {
  trigger: string;
  description: string;
  example: string;
}

type DiscordCommand = 'PLAY' | 'STOP' | 'ADD' | 'PLAYLIST' | 'DISCONNECT' | 'HELP';

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
  ADD: {
    trigger: '!add',
    description: `Commande qui permet d'ajouter une musique à une playlist`,
    example: '!add <youtube-url>',
  },
  PLAYLIST: {
    trigger: '!playlist',
    description: `Commande qui permet d'afficher la playlist en cours`,
    example: '!playlist',
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
