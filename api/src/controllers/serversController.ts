import supabase from '../config/database';

export const serversController = {
  list: async (_req: any, res: any) => {
    try {
      const { data, error } = await supabase.from('servers').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ servers: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'unknown error' });
    }
  },
};
