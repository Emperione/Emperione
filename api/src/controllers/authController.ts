import supabase from '../config/database';

export const authController = {
  callback: (_req: any, res: any) => res.json({ ok: true }),

  // GET /api/auth/by-discord-id?discordId=12345
  getByDiscordId: async (req: any, res: any) => {
    const discordId = String(req.query.discordId || '');
    if (!discordId)
      return res.status(400).json({ error: 'discordId is required' });

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('discord_id', discordId)
        .limit(1)
        .maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: 'User not found' });
      return res.json({ user: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'unknown error' });
    }
  },
};
