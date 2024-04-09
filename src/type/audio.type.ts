export interface Audio {
  url: string;
  title: string;
  duration: string;
}

export type AudioInfos = Omit<Audio, 'url'>;
