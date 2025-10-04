import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('DISCORD_TOKEN not set in environment');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Bot ready: ${client.user?.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login(token).catch((err) => {
  console.error('Failed to login', err);
  process.exit(1);
});
