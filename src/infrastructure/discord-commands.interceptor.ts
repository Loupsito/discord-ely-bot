import { Logger } from '@nestjs/common';

const logger = new Logger();
export function logCommand(command, message) {
  const userId = message.author.id;
  const serverName = message.guild.name;
  logger.log(`Command: ${command} by User: ${userId} in Server: ${serverName}`);
}
