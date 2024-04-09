import { Injectable, Logger } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import { Audio, AudioInfos } from '../../type/audio.type';

@Injectable()
export class YoutubeService {
  private logger = new Logger('DiscordCommandInterceptor');

  async getVideoTitle(url: string): Promise<AudioInfos> {
    try {
      const info = await ytdl.getInfo(url);
      return {
        title: info.videoDetails.title,
        duration: this.toMinutesAndSeconds(
          parseInt(info.videoDetails.lengthSeconds),
        ),
      };
    } catch (error) {
      this.logger.error('Error fetching video title:', error);
      return {
        title: 'Unknown title',
        duration: 'Unknown duration',
      };
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

  private toMinutesAndSeconds(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration - minutes * 60;
    return `${minutes} min : ${seconds} sec`;
  }
}
