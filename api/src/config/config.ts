import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
});

export type ApiConfig = z.infer<typeof envSchema> & { port?: number; nodeEnv: string };

export function loadConfig(): ApiConfig {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('API environment validation failed:', parsed.error.format());
    throw new Error('Invalid API environment variables');
  }
  const result = parsed.data;
  return {
    ...result,
    port: result.PORT ? Number(result.PORT) : undefined,
    nodeEnv: result.NODE_ENV,
  };
}
