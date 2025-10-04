import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.get('/by-discord-id', authController.getByDiscordId);
router.get('/discord/callback', (_req, res) => res.json({ ok: true }));

export default router;
