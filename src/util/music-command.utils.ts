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

export const isYoutubeUrl = (url: string) => {
  return url.startsWith('https://www.youtube.com/');
};

export const buildMessageToShowPlaylist = (playlist) => {
  let response = '**Playlist Actuelle:**\n';

  // Vérifiez si une piste est actuellement en lecture pour ajuster l'affichage
  playlist.queue.forEach((track, index) => {
    if (playlist.currentlyPlaying && index === 0) {
      // Pour la première piste, qui est en cours de lecture
      response += `1. ${track.title}\n**[▶️ En cours de lecture]**\n\n`;
    } else {
      // Pour les pistes suivantes, ou toutes les pistes si aucune n'est en cours de lecture
      const displayIndex = playlist.currentlyPlaying ? index + 1 : index + 1;
      response += `${displayIndex}. ${track.title}\n`;
    }
  });

  return response;
};
