import { MUSIC_MESSAGES } from '../type/discord-messages.type';

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

  if (playlist.currentlyPlaying) {
    const playingStatus = playlist.isPaused ? '[⏸️ En pause]' : '[▶️ En cours de lecture]';
    response += `1. ${playlist.currentlyPlaying.title} - [${playlist.currentlyPlaying.duration}]\n**${playingStatus}**\n\n`;
  }

  playlist.queue.forEach((track, index) => {
    const displayIndex = index + 1;
    if (index > 0 || !playlist.currentlyPlaying) {
      response += `${displayIndex}. ${track.title} - [${track.duration}]\n`;
    }
  });

  return response;
};
