import { Message } from 'discord.js';

export default function registerMessageCreate() {
  return async (message: Message) => {
    if (message.author.bot) return;
    // TODO: Hook into moderation service
    if (message.content === '!ping') {
      await message.reply('Pong!');
    }
  };
}
