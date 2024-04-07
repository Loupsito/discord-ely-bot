import { MUSIC_MESSAGES } from '../discord-messages.type';

export const extractUrlFromMessageContent = (message): Promise<string> => {
  return new Promise((resolve, reject) => {
    const commands: string = message.content.split(' ');

    if (commands.length < 2 || !isYoutubeUrl(commands[1])) {
      reject(MUSIC_MESSAGES.MUST_GIVE_YOUTUBE_URL);
    }

    resolve(commands[1]);
  });
};

export const replyErrorMessageIfNotInVoiceChannel = (message) => {
  return new Promise<void>((resolve, reject) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      reject(MUSIC_MESSAGES.USER_MUST_BE_IN_VOICE_CHANNEL);
    }
    resolve();
  });
};

export const isYoutubeUrl = (url: string) => {
  return url.startsWith('https://www.youtube.com/');
};

export const buildMessageToShowPlaylist = (playlist) => {
  let response = '**Playlist Actuelle:**\n';

  // Toujours afficher la chanson précédemment en lecture au début, même si la playlist est en pause
  if (playlist.currentlyPlaying) {
    const playingStatus = playlist.isPaused
      ? '[⏸️ En pause]'
      : '[▶️ En cours de lecture]';
    response += `1. ${playlist.currentlyPlaying.title}\n**${playingStatus}**\n\n`;
  }

  // Afficher les autres pistes de la playlist
  playlist.queue.forEach((track, index) => {
    // Ajuster l'index si une chanson est actuellement jouée ou était jouée
    const displayIndex = index + 1;
    // Pour ne pas répéter le morceau en cours de lecture s'il est le premier de la liste
    if (index > 0 || !playlist.currentlyPlaying) {
      response += `${displayIndex}. ${track.title}\n`;
    }
  });

  return response;
};
