import { z } from 'zod';

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_GUILD_ID: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Environment validation failed:', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export type BotConfig = {
  discordToken: string;
  clientId?: string;
  guildId?: string;
  nodeEnv: 'development' | 'production' | 'test';
};

const config: BotConfig = {
  discordToken: parsed.data.DISCORD_TOKEN,
  clientId: parsed.data.DISCORD_CLIENT_ID,
  guildId: parsed.data.DISCORD_GUILD_ID,
  nodeEnv: parsed.data.NODE_ENV,
};

export default config;
