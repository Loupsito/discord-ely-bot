import { MUSIC_MESSAGES } from '../discord-messages.type';
import { Playlist } from '../service/guild/guild.service';

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

export const buildMessageToShowPlaylist = (playlist: Playlist) => {
  let response = '**Playlist Actuelle:**\n';
  playlist.queue.forEach((track, index) => {
    response += `${index + 1}. ${track.title}\n`;
  });
  return response;
};
