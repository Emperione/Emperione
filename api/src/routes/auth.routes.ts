import { Router } from 'express';

const router = Router();

router.get('/discord/callback', (_req, res) => res.json({ ok: true }));

export default router;
