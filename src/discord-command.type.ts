interface DiscordCommandType {
  trigger: string;
  description: string;
  example: string;
}

type DiscordCommand =
  | 'PLAY'
  | 'STOP'
  | 'PAUSE'
  | 'RESUME'
  | 'ADD'
  | 'PLAYLIST'
  | 'EMPTY'
  | 'NEXT'
  | 'DISCONNECT'
  | 'HELP';

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
  PAUSE: {
    trigger: '!pause',
    description: `Commande qui permet de mettre en pause la musique en cours`,
    example: '!pause',
  },
  RESUME: {
    trigger: '!resume',
    description: `Commande qui permet de relancer la lecture de la musique précédemment mis en pause`,
    example: '!resume',
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
  EMPTY: {
    trigger: '!empty',
    description: `Commande qui permet de vider la playlist en cours`,
    example: '!empty',
  },
  NEXT: {
    trigger: '!next',
    description: `Commande qui permet de passer à la musique suivante dans la playlist`,
    example: '!next',
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
