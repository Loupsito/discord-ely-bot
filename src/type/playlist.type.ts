import { Audio } from './audio.type';

export interface Playlist {
  textChannel: any;
  queue: Audio[];
  currentlyPlaying: Audio;
  isPaused: boolean;
  isMarkedAsEmpty: boolean;
  isListenerAttached: boolean;
}
