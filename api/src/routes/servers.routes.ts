import { Router } from 'express';
import { serversController } from '../controllers/serversController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validator';
import { createServerSchema, updateServerSchema } from '../validators/servers';

const router = Router();

// Public
router.get('/', serversController.list);

// Protected
router.post('/', requireAuth, validateBody(createServerSchema), serversController.create);
router.put('/:id', requireAuth, validateBody(updateServerSchema), serversController.update);
router.delete('/:id', requireAuth, serversController.remove);

export default router;
