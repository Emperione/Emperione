import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import config from './config/config';

// Basic logger (replace with structured logger later)
const log = (level: 'info' | 'warn' | 'error', msg: string) => console[level](`${new Date().toISOString()} [${level.toUpperCase()}] ${msg}`);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  log('info', `Bot ready: ${client.user?.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!').catch((err) => log('error', `reply failed: ${String(err)}`));
  }
});

async function start() {
  try {
    await client.login(config.discordToken);
    log('info', `Logged in (env=${config.nodeEnv})`);
  } catch (err) {
    log('error', `Failed to login: ${String(err)}`);
    process.exit(1);
  }
}

function shutdown() {
  log('info', 'Shutting down bot...');
  client.destroy();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();

