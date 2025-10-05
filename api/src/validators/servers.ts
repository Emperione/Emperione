import { z } from 'zod';

export const createServerSchema = z.object({
  discord_id: z.string().min(1),
  name: z.string().min(1).optional(),
  owner_id: z.string().uuid().optional(),
});

export const updateServerSchema = z.object({
  name: z.string().min(1).optional(),
  owner_id: z.string().uuid().optional(),
});

export default { createServerSchema, updateServerSchema };
