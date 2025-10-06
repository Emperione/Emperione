import { Router } from 'express';

import authRoutes from './auth.routes';
import serversRoutes from './servers.routes';
import analyticsRoutes from './analytics.routes';
import moderationRoutes from './moderation.routes';
import membersRoutes from './members.routes';
import settingsRoutes from './settings.routes';

const router = Router();

// Mount individual route modules under /api
router.use('/auth', authRoutes);
router.use('/servers', serversRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/moderation', moderationRoutes);
router.use('/members', membersRoutes);
router.use('/settings', settingsRoutes);

export default router;
