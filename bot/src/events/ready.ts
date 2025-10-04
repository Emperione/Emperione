import { Client } from 'discord.js';
import logger from '../utils/logger';

export default function registerReady(client: Client) {
  client.once('ready', () => {
    logger.info(`Ready: ${client.user?.tag}`);
  });
}
