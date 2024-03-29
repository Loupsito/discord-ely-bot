import { Logger } from '@nestjs/common';

const logger = new Logger('DiscordCommandInterceptor');
export function logCommand(command, message) {
  const userId = message.author.globalName;
  const serverName = message.guild.name;
  logger.log(
    `Command: '${command}' run by user: ${userId} in server: ${serverName}`,
  );
}
