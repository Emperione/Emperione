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

  create: async (req: any, res: any) => {
    const payload = req.body || {};
    try {
      const { data, error } = await supabase.from('servers').insert(payload).select().maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ server: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'unknown error' });
    }
  },

  update: async (req: any, res: any) => {
    const id = req.params.id;
    const payload = req.body || {};
    try {
      const { data, error } = await supabase.from('servers').update(payload).eq('id', id).select().maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ server: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'unknown error' });
    }
  },

  remove: async (req: any, res: any) => {
    const id = req.params.id;
    try {
      const { error } = await supabase.from('servers').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(204).send();
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'unknown error' });
    }
  },
};
