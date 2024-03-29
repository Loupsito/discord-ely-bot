import { Injectable } from '@nestjs/common';
import { COMMANDS } from '../../discord-command.type';

@Injectable()
export class HelpService {
  listAllCommands(message: any) {
    let helpMessage = 'Voici les commandes disponibles :\n\n';
    for (const commandKey of Object.keys(COMMANDS)) {
      const command = COMMANDS[commandKey];
      helpMessage += `**➡️ ${command.trigger}: ${command.description}**\nExemple : ${command.example} \n\n`;
    }
    return message.reply(helpMessage);
  }
}
