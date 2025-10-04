import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const ApiConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
});

export type ApiConfig = {
  port?: number;
  nodeEnv: 'development' | 'test' | 'production';
  databaseUrl?: string;
};

export function loadConfig(): ApiConfig {
  const parsed = ApiConfigSchema.safeParse(process.env);

  if (!parsed.success) {
    // Print friendly validation errors and exit
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:');
    // eslint-disable-next-line no-console
    console.error(parsed.error.format());
    throw new Error('Invalid environment configuration');
  }

  const cfg = parsed.data;

  return {
    nodeEnv: cfg.NODE_ENV,
    port: cfg.PORT ? Number(cfg.PORT) : undefined,
    databaseUrl: cfg.DATABASE_URL,
  };
}
