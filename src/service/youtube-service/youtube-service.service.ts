import { Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';

@Injectable()
export class YoutubeService {
  async getVideoTitle(url: string): Promise<string> {
    try {
      const info = await ytdl.getInfo(url);
      return info.videoDetails.title;
    } catch (error) {
      console.error('Error fetching video title:', error);
      return 'Unknown title';
    }
  }
  getStream(url: string) {
    return ytdl(url, { filter: 'audioonly', highWaterMark: 32 * 1024 * 1024 });
  }
}
