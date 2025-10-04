import { Router } from 'express';

const router = Router();

router.get('/growth', (_req, res) => res.json({ growth: [] }));

export default router;
