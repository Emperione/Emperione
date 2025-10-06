import { Message } from 'discord.js';

export const moderationService = {
  async evaluateMessage(_message: Message) {
    // Placeholder: run moderation rules
    return { action: null };
  },
};
