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

  if (playlist.currentlyPlaying) {
    response += `**▶️ En cours de lecture :** ${playlist.currentlyPlaying.title}\n`;
  }

  playlist.queue.forEach((track, index) => {
    const displayIndex = playlist.currentlyPlaying ? index + 2 : index + 1;
    response += `${displayIndex}. ${track.title}\n`;
  });

  return response;
};
