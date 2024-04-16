import { Injectable } from '@nestjs/common';
import {
  COMMANDS_AUDIO_PLAYER,
  COMMANDS_OTHER,
  COMMANDS_PLAYLIST,
} from '../../type/discord-command.type';

@Injectable()
export class HelpService {
  listAllCommands(message: any) {
    let helpMessage = 'Voici les commandes disponibles :\n\n';

    helpMessage += this.buildMessageToListCommands(
      `📻 Commandes lecteur audio`,
      COMMANDS_AUDIO_PLAYER,
    );
    helpMessage += this.buildMessageToListCommands(`💿 Commandes playlist`, COMMANDS_PLAYLIST);
    helpMessage += this.buildMessageToListCommands(`🔰 Autres commandes`, COMMANDS_OTHER);

    message.reply(helpMessage);
  }

  private buildMessageToListCommands(title: string, Commands: Record<any, any>) {
    let helpMessage = `**--------------------${title}--------------------**\n\n`;
    for (const commandKey of Object.keys(Commands)) {
      const command = Commands[commandKey];
      helpMessage += `**➡️ ${command.trigger}: ${command.description}**\nExemple : ${command.example} \n\n`;
    }
    return helpMessage;
  }
}
