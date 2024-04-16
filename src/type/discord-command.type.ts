interface DiscordCommandType {
  trigger: string;
  description: string;
  example: string;
}

type CommandAudioPlayer = 'PLAY' | 'STOP' | 'PAUSE' | 'RESUME';

type CommandPlaylist = 'ADD' | 'PLAYLIST' | 'EMPTY' | 'NEXT' | 'RESUMEPLAYLIST';

type CommandOther = 'DISCONNECT' | 'HELP';

export const COMMANDS_AUDIO_PLAYER: Record<CommandAudioPlayer, DiscordCommandType> = {
  PLAY: {
    trigger: '!play',
    description: `Commande qui permet de jouer une musique venant de Youtube. Si une playlist est en cours de lecture, cette commande va mettre en pause cette dernière.`,
    example: '!play <youtube-url>',
  },
  STOP: {
    trigger: '!stop',
    description: `Commande qui permet de stopper une musique en cours de lecture. Vide aussi la playlist en s'il y en a une`,
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
};
export const COMMANDS_PLAYLIST: Record<CommandPlaylist, DiscordCommandType> = {
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
    description: `Commande qui permet de vider la playlist en cours (cette commande ne supprime pas la musique en cours de lecture)`,
    example: '!empty',
  },
  NEXT: {
    trigger: '!next',
    description: `Commande qui permet de passer à la musique suivante dans la playlist. Si playlist est en pause, il faudra d'abord relancer cette dernière en exécutant la commande __!resumePlaylist__`,
    example: '!next',
  },
  RESUMEPLAYLIST: {
    trigger: '!resumePlaylist',
    description: `Commande qui permet de reprendre la lecture de la playlist précédemment mis en pause`,
    example: '!resumePlaylist',
  },
};
export const COMMANDS_OTHER: Record<CommandOther, DiscordCommandType> = {
  DISCONNECT: {
    trigger: '!disconnect',
    description: 'Commande qui permet de déconnecter le bot se trouvant dans un channel vocal.',
    example: '!disconnect',
  },
  HELP: {
    trigger: '!manual',
    description: `Commande qui permet d'afficher toutes les commandes disponibles du bot.`,
    example: '!manual',
  },
};
