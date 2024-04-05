import { Injectable, Logger } from '@nestjs/common';
import * as ytdl from 'ytdl-core';

@Injectable()
export class YoutubeService {
  private logger = new Logger('DiscordCommandInterceptor');

  async getVideoTitle(url: string): Promise<string> {
    try {
      const info = await ytdl.getInfo(url);
      return info.videoDetails.title;
    } catch (error) {
      this.logger.error('Error fetching video title:', error);
      return 'Unknown title';
    }
  }
  getStream(url: string) {
    const COOKIE = `YSC=90QeZTohnO4; VISITOR_PRIVACY_METADATA=CgJGUhIIEgQSAgsMIC4%3D; PREF=f6=40000000&tz=Europe.Paris; SOCS=CAISEwgDEgk2MjE0MDk3NTcaAmZyIAEaBgiA_rywBg; VISITOR_INFO1_LIVE=BHr_3SggUVY; GPS=1`;
    return ytdl(url, {
      filter: 'audioonly',
      highWaterMark: 32 * 1024 * 1024,
      requestOptions: {
        headers: {
          cookie: COOKIE,
          // Optional. If not given, ytdl-core will try to find it.
          // You can find this by going to a video's watch page, viewing the source,
          // and searching for "ID_TOKEN".
          // 'x-youtube-identity-token': 1324,
        },
      },
    });
  }
}
